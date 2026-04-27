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
        const container = document.getElementById('print-card-container');
        container.innerHTML = '';
        
        // 创建卡片内容区
        const cardContent = document.createElement('div');
        cardContent.className = 'print-card-content';
        
        // 找原页面的关键元素
        const root = document.getElementById('root');
        if (!root) return;
        
        // 克隆整个结果区域
        const resultClone = root.cloneNode(true);
        
        // 移除不需要的元素（按钮、输入框等）
        const removeSelectors = 'button, input, nav, .nav, [class*="button"], [class*="input"], [class*="form"]';
        resultClone.querySelectorAll(removeSelectors).forEach(el => el.remove());
        
        // 重新组织内容
        // 1. 饮品图片
        const drinkImg = resultClone.querySelector('img[src*="drink"], img[width="200"], img[width="300"]') ||
                        resultClone.querySelector('img');
        if (drinkImg) {
            drinkImg.className = 'drink-image';
            cardContent.appendChild(drinkImg);
        }
        
        // 2. 饮品名称
        const nameEl = resultClone.querySelector('h1, h2, .text-2xl, .text-xl');
        if (nameEl) {
            nameEl.className = 'drink-name';
            cardContent.appendChild(nameEl);
        }
        
        // 3. 纳音
        const nayinEl = resultClone.querySelector('[class*="nayin"]');
        if (nayinEl) {
            nayinEl.className = 'nayin';
            cardContent.appendChild(nayinEl);
        }
        
        // 4. 五行分布
        const wuxingEl = resultClone.querySelector('[class*="wuxing"], [class*="element"]');
        if (wuxingEl) {
            wuxingEl.className = 'wuxing';
            cardContent.appendChild(wuxingEl);
        }
        
        // 5. 雷达图（如果有）
        const radarEl = resultClone.querySelector('canvas, svg, [class*="radar"], [class*="chart"]');
        if (radarEl) {
            radarEl.className = 'radar-chart';
            cardContent.appendChild(radarEl);
        }
        
        // 6. 气泡温度
        const propsEl = resultClone.querySelector('[class*="bubble"], [class*="temp"], [class*="property"]');
        if (propsEl) {
            propsEl.className = 'properties';
            cardContent.appendChild(propsEl);
        }
        
        // 7. 描述文案
        const descEl = resultClone.querySelector('p, [class*="desc"]');
        if (descEl && descEl.textContent.length > 10) {
            descEl.className = 'description';
            cardContent.appendChild(descEl);
        }
        
        // 8. 最佳伴侣
        const partnerEl = resultClone.querySelector('[class*="partner"], [class*="match"]');
        if (partnerEl) {
            partnerEl.className = 'partner';
            const label = partnerEl.querySelector('[class*="label"], span:first-child');
            if (label) label.className = 'partner-label';
            const content = partnerEl.querySelector('[class*="content"], div');
            if (content) content.className = 'partner-content';
            cardContent.appendChild(partnerEl);
        }
        
        // 底部
        const footer = document.createElement('div');
        footer.className = 'print-card-footer';
        footer.textContent = '五行纳音 · 本命饮品';
        cardContent.appendChild(footer);
        
        container.appendChild(cardContent);
    }
    
    // 打印卡片
    function printCard() {
        if (!isResultPage()) {
            alert('未检测到结果内容，请确保在结果页');
            return;
        }
        cloneAndReformat();
        window.print();
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