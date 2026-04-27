// 打印卡片功能 - 14cm x 10cm 竖版小卡片
// 策略：克隆结果页内容，重新排版成卡片尺寸
(function() {
    'use strict';
    
    console.log('Print card script loading...');
    
    // 创建打印按钮
    function createPrintButton() {
        const btn = document.createElement('button');
        btn.id = 'print-card-btn';
        btn.innerHTML = '🖨️ 打印结果卡片';
        btn.style.cssText = `
            display: none;
            width: 100%;
            padding: 16px;
            background: #333;
            color: #fff;
            border: none;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        `;
        btn.onclick = printCard;
        
        // 插入到页面底部
        const root = document.getElementById('root');
        if (root) {
            root.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
        return btn;
    }
    
    // 创建打印容器（用于重新排版）
    function createPrintContainer() {
        const container = document.createElement('div');
        container.id = 'print-card-container';
        container.className = 'print-only';
        document.body.appendChild(container);
        return container;
    }
    
    // 添加打印样式
    function addPrintStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .print-only { display: none !important; }
            
            @media print {
                /* 隐藏原页面 */
                body > *:not(.print-only) { display: none !important; }
                
                /* 显示打印容器 */
                .print-only {
                    display: block !important;
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    background: #F7F5F0;
                    margin: 0; padding: 0;
                    overflow: hidden;
                }
                
                /* 卡片内容区 */
                .print-card-content {
                    width: 10cm;
                    height: 14cm;
                    margin: 0 auto;
                    background: #F7F5F0;
                    padding: 0.6cm;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                /* 饮品图片 */
                .print-card-content .drink-image {
                    width: 2.5cm;
                    height: auto;
                    margin-bottom: 0.3cm;
                }
                
                /* 饮品名称 */
                .print-card-content h1,
                .print-card-content h2,
                .print-card-content .drink-name {
                    font-size: 20pt !important;
                    margin: 0 0 0.2cm 0 !important;
                    font-weight: 600;
                    color: #333;
                }
                
                /* 纳音 */
                .print-card-content .nayin {
                    font-size: 10pt;
                    color: #666;
                    margin: 0 0 0.15cm 0;
                }
                
                /* 五行分布 */
                .print-card-content .wuxing {
                    font-size: 9pt;
                    color: #888;
                    margin: 0 0 0.3cm 0;
                    letter-spacing: 0.1em;
                }
                
                /* 雷达图区域 - 缩小 */
                .print-card-content .radar-chart,
                .print-card-content canvas,
                .print-card-content svg {
                    max-width: 4cm !important;
                    max-height: 4cm !important;
                    margin: 0.2cm 0;
                }
                
                /* 气泡温度 */
                .print-card-content .properties {
                    display: flex;
                    justify-content: center;
                    gap: 1cm;
                    margin: 0.2cm 0;
                    font-size: 9pt;
                }
                
                /* 描述文案 */
                .print-card-content .description {
                    font-size: 9pt;
                    line-height: 1.5;
                    color: #333;
                    margin: 0.3cm 0;
                    padding: 0 0.2cm;
                }
                
                /* 最佳伴侣 */
                .print-card-content .partner {
                    border-top: 1px solid #ddd;
                    padding-top: 0.3cm;
                    margin-top: 0.2cm;
                    width: 100%;
                }
                
                .print-card-content .partner-label {
                    font-size: 8pt;
                    color: #999;
                    margin-bottom: 0.15cm;
                }
                
                .print-card-content .partner-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.3cm;
                }
                
                .print-card-content .partner-content img {
                    width: 1.2cm;
                    height: auto;
                }
                
                .print-card-content .partner-content span {
                    font-size: 10pt;
                    color: #333;
                }
                
                /* 底部 */
                .print-card-footer {
                    font-size: 7pt;
                    color: #bbb;
                    margin-top: auto;
                    padding-top: 0.3cm;
                }
                
                @page {
                    size: 10cm 14cm;
                    margin: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 检查是否在结果页
    function isResultPage() {
        const bodyText = document.body.innerText;
        const drinks = ['青柚乌龙', '松针青梅', '赤霞血橙', '暖姜红茶', '海盐白桃', '椰青荔枝', '玄米柠檬', '燕麦可可', '茉莉汤力', '轻咖汤力', '青桔乳酸', '紫苏话梅'];
        return drinks.some(d => bodyText.includes(d)) && bodyText.includes('纳音');
    }
    
    // 克隆结果页内容并重新排版
    function cloneAndReformat() {
        console.log('Cloning and reformatting...');
        const container = document.getElementById('print-card-container');
        container.innerHTML = '';
        
        // 创建卡片内容区
        const cardContent = document.createElement('div');
        cardContent.className = 'print-card-content';
        
        // 找原页面的关键元素
        const root = document.getElementById('root');
        if (!root) {
            console.error('Root element not found');
            return;
        }
        
        console.log('Root found, children:', root.children.length);
        
        // 克隆整个结果区域
        const resultClone = root.cloneNode(true);
        
        // 移除不需要的元素（按钮、输入框等）
        const removeSelectors = 'button, input, nav, .nav, [class*="button"], [class*="input"], [class*="form"]';
        resultClone.querySelectorAll(removeSelectors).forEach(el => el.remove());
        
        // 重新组织内容 - 按顺序添加各个部分
        
        // 1. 饮品图片 - 找最大的图片
        const allImgs = Array.from(resultClone.querySelectorAll('img'));
        const drinkImg = allImgs.find(img => {
            const rect = img.getBoundingClientRect ? {width: img.width, height: img.height} : {width: 0, height: 0};
            return rect.width > 50 || img.naturalWidth > 50;
        }) || allImgs[0];
        
        if (drinkImg) {
            console.log('Found drink image:', drinkImg.src);
            drinkImg.style.width = '2.5cm';
            drinkImg.style.height = 'auto';
            drinkImg.style.marginBottom = '0.3cm';
            cardContent.appendChild(drinkImg);
        }
        
        // 2. 饮品名称
        const nameEl = resultClone.querySelector('h1, h2, .text-2xl, .text-xl, [class*="title"]');
        if (nameEl) {
            console.log('Found name:', nameEl.textContent);
            nameEl.style.fontSize = '20pt';
            nameEl.style.margin = '0 0 0.2cm 0';
            nameEl.style.fontWeight = '600';
            cardContent.appendChild(nameEl);
        }
        
        // 3. 纳音
        const nayinEl = resultClone.querySelector('[class*="nayin"]');
        if (nayinEl) {
            console.log('Found nayin:', nayinEl.textContent);
            nayinEl.style.fontSize = '10pt';
            nayinEl.style.color = '#666';
            nayinEl.style.margin = '0 0 0.15cm 0';
            cardContent.appendChild(nayinEl);
        }
        
        // 4. 五行分布
        const wuxingEl = resultClone.querySelector('[class*="wuxing"], [class*="element"]');
        if (wuxingEl) {
            console.log('Found wuxing:', wuxingEl.textContent);
            wuxingEl.style.fontSize = '9pt';
            wuxingEl.style.color = '#888';
            wuxingEl.style.margin = '0 0 0.3cm 0';
            cardContent.appendChild(wuxingEl);
        }
        
        // 5. 雷达图（如果有）
        const radarEl = resultClone.querySelector('canvas, svg, [class*="radar"], [class*="chart"]');
        if (radarEl) {
            console.log('Found radar chart');
            radarEl.style.maxWidth = '4cm';
            radarEl.style.maxHeight = '4cm';
            radarEl.style.margin = '0.2cm 0';
            cardContent.appendChild(radarEl);
        }
        
        // 6. 气泡温度
        const propsEl = resultClone.querySelector('[class*="bubble"], [class*="temp"], [class*="property"]');
        if (propsEl) {
            console.log('Found properties:', propsEl.textContent);
            propsEl.style.display = 'flex';
            propsEl.style.justifyContent = 'center';
            propsEl.style.gap = '1cm';
            propsEl.style.margin = '0.2cm 0';
            propsEl.style.fontSize = '9pt';
            cardContent.appendChild(propsEl);
        }
        
        // 7. 描述文案
        const descEl = resultClone.querySelector('p, [class*="desc"]');
        if (descEl && descEl.textContent.length > 10) {
            console.log('Found description:', descEl.textContent.substring(0, 50));
            descEl.style.fontSize = '9pt';
            descEl.style.lineHeight = '1.5';
            descEl.style.margin = '0.3cm 0';
            descEl.style.padding = '0 0.2cm';
            cardContent.appendChild(descEl);
        }
        
        // 8. 最佳伴侣
        const partnerEl = resultClone.querySelector('[class*="partner"], [class*="match"]');
        if (partnerEl) {
            console.log('Found partner:', partnerEl.textContent.substring(0, 50));
            partnerEl.style.borderTop = '1px solid #ddd';
            partnerEl.style.paddingTop = '0.3cm';
            partnerEl.style.marginTop = '0.2cm';
            partnerEl.style.width = '100%';
            cardContent.appendChild(partnerEl);
        }
        
        // 底部
        const footer = document.createElement('div');
        footer.style.fontSize = '7pt';
        footer.style.color = '#bbb';
        footer.style.marginTop = 'auto';
        footer.style.paddingTop = '0.3cm';
        footer.textContent = '五行纳音 · 本命饮品';
        cardContent.appendChild(footer);
        
        container.appendChild(cardContent);
        console.log('Card content created');
    }
    
    // 打印卡片
    function printCard() {
        console.log('Print button clicked');
        if (!isResultPage()) {
            alert('未检测到结果内容，请确保在结果页');
            return;
        }
        try {
            cloneAndReformat();
            console.log('Calling window.print()');
            window.print();
        } catch (e) {
            console.error('Print error:', e);
            alert('打印出错: ' + e.message);
        }
    }
    
    // 初始化
    function init() {
        console.log('Initializing print card...');
        
        addPrintStyles();
        createPrintContainer();
        const btn = createPrintButton();
        
        // 监听页面变化
        const observer = new MutationObserver(() => {
            if (isResultPage()) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
        
        observer.observe(document.body, { subtree: true, childList: true });
        
        if (isResultPage()) {
            btn.style.display = 'block';
        }
        
        console.log('Print card initialized');
    }
    
    // 延迟初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 3000));
    } else {
        setTimeout(init, 3000);
    }
})();