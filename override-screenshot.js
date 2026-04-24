document.addEventListener('DOMContentLoaded', () => {
    // 等待 html2canvas 加载完成
    function initScreenshot() {
        const saveButton = document.querySelector('button.flex-1.py-4.text-base.font-bold.text-\[#2C2C2C\]');
        const screenshotTarget = document.querySelector('[code-path="src/sections/ResultPage.tsx:275:5"]');

        if (!saveButton || !screenshotTarget) {
            console.warn('Save button or screenshot target not found. Retrying...');
            setTimeout(initScreenshot, 1000);
            return;
        }

        if (!window.html2canvas) {
            console.warn('html2canvas not loaded yet. Retrying...');
            setTimeout(initScreenshot, 1000);
            return;
        }

        console.log('Screenshot initialized successfully');

        let pressTimer;
        const longPressDuration = 800; // 800ms for long press

        const startPress = (e) => {
            if (e.type === 'touchstart') {
                e.preventDefault();
            }
            
            // 添加按压效果
            saveButton.style.transform = 'scale(0.95)';
            saveButton.style.opacity = '0.8';

            pressTimer = setTimeout(() => {
                // 恢复样式
                saveButton.style.transform = '';
                saveButton.style.opacity = '';
                
                // 震动反馈（如果支持）
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                console.log('Long press detected! Taking screenshot...');
                takeScreenshot();
            }, longPressDuration);
        };

        const cancelPress = () => {
            clearTimeout(pressTimer);
            saveButton.style.transform = '';
            saveButton.style.opacity = '';
        };

        // 移除旧事件监听器（防止重复）
        saveButton.removeEventListener('touchstart', startPress);
        saveButton.removeEventListener('touchend', cancelPress);
        saveButton.removeEventListener('touchcancel', cancelPress);
        saveButton.removeEventListener('mousedown', startPress);
        saveButton.removeEventListener('mouseup', cancelPress);
        saveButton.removeEventListener('mouseleave', cancelPress);

        // 添加新事件监听器
        saveButton.addEventListener('touchstart', startPress, { passive: false });
        saveButton.addEventListener('touchend', cancelPress);
        saveButton.addEventListener('touchcancel', cancelPress);
        saveButton.addEventListener('mousedown', startPress);
        saveButton.addEventListener('mouseup', cancelPress);
        saveButton.addEventListener('mouseleave', cancelPress);

        const takeScreenshot = () => {
            if (!window.html2canvas) {
                console.error('html2canvas not loaded!');
                alert('截图功能加载中，请稍后再试');
                return;
            }

            // 显示加载提示
            const toast = document.createElement('div');
            toast.textContent = '正在生成图片...';
            toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:16px 24px;border-radius:8px;z-index:9999;font-size:16px;';
            document.body.appendChild(toast);

            // 获取目标元素的精确尺寸（使用 scrollWidth/Height 包含完整内容）
            const width = Math.round(screenshotTarget.scrollWidth);
            const height = Math.round(screenshotTarget.scrollHeight);
            
            // 设置 canvas 尺寸为元素完整尺寸的 4 倍（超高清）
            const scale = 4;
            const canvasWidth = width * scale;
            const canvasHeight = height * scale;
            
            html2canvas(screenshotTarget, {
                useCORS: true,
                scale: scale,
                logging: false,
                allowTaint: true,
                backgroundColor: '#F7F5F0',
                imageTimeout: 15000,
                // 使用完整尺寸，避免裁剪
                width: width,
                height: height,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                // 从元素左上角开始
                x: 0,
                y: 0,
                // 不滚动，完整捕获
                scrollX: -window.scrollX,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
                onclone: (clonedDoc) => {
                    const images = clonedDoc.querySelectorAll('img');
                    images.forEach(img => {
                        img.crossOrigin = 'anonymous';
                    });
                }
            }).then(canvas => {
                document.body.removeChild(toast);
                
                // 使用 PNG 保证最高质量
                const dataUrl = canvas.toDataURL('image/png');
                
                // 创建下载链接
                const link = document.createElement('a');
                link.download = `五行纳音-${new Date().getTime()}.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('Screenshot saved:', canvasWidth, 'x', canvasHeight, 'File size:', Math.round(dataUrl.length / 1024), 'KB');
            }).catch(error => {
                document.body.removeChild(toast);
                console.error('Screenshot failed:', error);
                alert('截图失败，请重试。错误：' + error.message);
            });
        };
    }

    // 延迟初始化，等待所有资源加载
    setTimeout(initScreenshot, 2000);
});
