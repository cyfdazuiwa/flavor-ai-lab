// 打印卡片功能 - 14cm x 10cm 竖版小卡片
// 风格：极简线性设计，参考 Hudson Gavin Martin
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
        
        const root = document.getElementById('root');
        if (root) {
            root.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
        return btn;
    }
    
    // 创建打印容器
    function createPrintContainer() {
        const container = document.createElement('div');
        container.id = 'print-card-container';
        container.className = 'print-only';
        document.body.appendChild(container);
        return container;
    }
    
    // 添加打印样式 - 极简线性设计
    function addPrintStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .print-only { display: none !important; }
            
            @media print {
                @page {
                    size: 10cm 14cm;
                    margin: 0;
                }
                
                body > *:not(.print-only) { display: none !important; }
                
                .print-only {
                    display: block !important;
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    background: #fff;
                    margin: 0; padding: 0;
                    overflow: hidden;
                }
                
                .print-card-content {
                    width: 10cm;
                    height: 14cm;
                    margin: 0 auto;
                    background: #fff;
                    padding: 0.5cm;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    font-family: "Helvetica Neue", Arial, sans-serif;
                }
                
                /* 顶部标签 */
                .print-card-content .result-label {
                    font-size: 7pt;
                    color: #999;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    margin-bottom: 0.2cm;
                }
                
                /* 饮品图片 */
                .print-card-content .drink-img {
                    width: 1.8cm;
                    height: auto;
                    margin: 0.2cm 0;
                }
                
                /* 饮品名称 - 大标题 */
                .print-card-content h1 {
                    font-size: 20pt !important;
                    margin: 0.1cm 0 !important;
                    font-weight: 500;
                    color: #000;
                    letter-spacing: 0.05em;
                }
                
                /* 纳音 - 小字 */
                .print-card-content .nayin {
                    font-size: 8pt;
                    color: #666;
                    margin: 0.05cm 0 0.15cm 0;
                }
                
                /* 五行分布 */
                .print-card-content .wuxing {
                    font-size: 9pt;
                    color: #333;
                    margin: 0 0 0.2cm 0;
                    letter-spacing: 0.15em;
                }
                
                /* 分隔线 */
                .print-card-content .divider {
                    width: 100%;
                    height: 1px;
                    background: #000;
                    margin: 0.15cm 0;
                }
                
                /* 区块标题 */
                .print-card-content h3 {
                    font-size: 7pt !important;
                    color: #999;
                    margin: 0.1cm 0 !important;
                    font-weight: 400;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                
                /* 雷达图 */
                .print-card-content .radar-img {
                    max-width: 3cm !important;
                    max-height: 3cm !important;
                    margin: 0.1cm 0;
                }
                
                /* 五行图例 */
                .print-card-content .wuxing-legend {
                    font-size: 7pt;
                    color: #666;
                    margin: 0.1cm 0;
                }
                
                /* 气泡温度 - 网格布局 */
                .print-card-content .properties {
                    display: flex;
                    justify-content: center;
                    gap: 1.5cm;
                    margin: 0.1cm 0;
                    width: 100%;
                }
                
                .print-card-content .property-item {
                    text-align: center;
                }
                
                .print-card-content .property-label {
                    font-size: 6pt;
                    color: #999;
                    margin-bottom: 0.05cm;
                }
                
                .print-card-content .property-value {
                    font-size: 9pt;
                    color: #000;
                    font-weight: 500;
                }
                
                /* 描述文案 */
                .print-card-content .desc {
                    font-size: 8pt;
                    line-height: 1.5;
                    color: #333;
                    margin: 0.15cm 0;
                    padding: 0 0.3cm;
                }
                
                /* 洞察 */
                .print-card-content .insight {
                    font-size: 7pt;
                    line-height: 1.4;
                    color: #666;
                    margin: 0.1cm 0;
                    padding: 0 0.3cm;
                    font-style: italic;
                }
                
                /* 最佳伴侣区块 */
                .print-card-content .partner-section {
                    width: 100%;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    padding: 0.15cm 0;
                    margin: 0.15cm 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.3cm;
                }
                
                .print-card-content .partner-section img {
                    width: 0.8cm;
                    height: auto;
                }
                
                .print-card-content .partner-info {
                    text-align: left;
                }
                
                .print-card-content .partner-name {
                    font-size: 9pt;
                    color: #000;
                    font-weight: 500;
                }
                
                .print-card-content .partner-nayin {
                    font-size: 7pt;
                    color: #999;
                }
                
                /* 音乐 */
                .print-card-content .music {
                    font-size: 7pt;
                    color: #666;
                    margin: 0.1cm 0;
                }
                
                /* 底部 */
                .print-card-footer {
                    font-size: 6pt;
                    color: #bbb;
                    margin-top: auto;
                    padding-top: 0.2cm;
                    letter-spacing: 0.1em;
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
        
        const cardContent = document.createElement('div');
        cardContent.className = 'print-card-content';
        
        const root = document.getElementById('root');
        if (!root) {
            console.error('Root not found');
            return;
        }
        
        // 获取所有元素
        const allElements = Array.from(root.querySelectorAll('*'));
        const allP = Array.from(root.querySelectorAll('p'));
        const h3s = Array.from(root.querySelectorAll('h3'));
        
        // 1. RESULT 标签
        const resultLabel = document.createElement('div');
        resultLabel.className = 'result-label';
        resultLabel.textContent = 'Result';
        cardContent.appendChild(resultLabel);
        
        // 2. 饮品图片
        const drinkImg = root.querySelector('img[alt]');
        if (drinkImg) {
            const img = document.createElement('img');
            img.src = drinkImg.src;
            img.alt = drinkImg.alt;
            img.className = 'drink-img';
            cardContent.appendChild(img);
        }
        
        // 3. 饮品名称
        const h1 = root.querySelector('h1');
        if (h1) {
            const name = document.createElement('h1');
            name.textContent = h1.textContent;
            cardContent.appendChild(name);
        }
        
        // 4. 纳音
        const nayinP = allP.find(p => p.textContent.includes('纳音'));
        if (nayinP) {
            const nayin = document.createElement('p');
            nayin.className = 'nayin';
            nayin.textContent = nayinP.textContent;
            cardContent.appendChild(nayin);
        }
        
        // 5. 五行分布
        const wuxingP = allP.find(p => /[木火土金水]\d/.test(p.textContent));
        if (wuxingP) {
            const wuxing = document.createElement('p');
            wuxing.className = 'wuxing';
            wuxing.textContent = wuxingP.textContent;
            cardContent.appendChild(wuxing);
        }
        
        // 分隔线
        const divider1 = document.createElement('div');
        divider1.className = 'divider';
        cardContent.appendChild(divider1);
        
        // 6. 五行属性分布
        const wuxingH3 = h3s.find(h => h.textContent.includes('五行'));
        if (wuxingH3) {
            const title = document.createElement('h3');
            title.textContent = wuxingH3.textContent;
            cardContent.appendChild(title);
        }
        
        // 雷达图
        const radar = root.querySelector('svg, canvas');
        if (radar) {
            console.log('Found radar');
            const radarClone = radar.cloneNode(true);
            // SVG 不能用 className，用 setAttribute
            if (radarClone.tagName === 'svg' || radarClone.tagName === 'SVG') {
                radarClone.setAttribute('class', 'radar-img');
            } else {
                radarClone.className = 'radar-img';
            }
            radarClone.style.maxWidth = '3cm';
            radarClone.style.maxHeight = '3cm';
            cardContent.appendChild(radarClone);
        }
        
        // 五行图例（如果有）
        const legend = root.querySelector('[class*="legend"], [class*="color"]');
        if (legend) {
            const legendClone = legend.cloneNode(true);
            legendClone.className = 'wuxing-legend';
            cardContent.appendChild(legendClone);
        }
        
        // 分隔线
        const divider2 = document.createElement('div');
        divider2.className = 'divider';
        cardContent.appendChild(divider2);
        
        // 7. 气泡温度
        const bubbleP = allP.find(p => p.textContent.includes('气泡') || p.textContent.includes('温度'));
        if (bubbleP) {
            const props = document.createElement('div');
            props.className = 'properties';
            
            // 找气泡和温度的值
            const allText = root.innerText;
            const bubbleMatch = allText.match(/气泡[\s\n]*([^\n]+)/);
            const tempMatch = allText.match(/温度[\s\n]*([^\n]+)/);
            
            if (bubbleMatch) {
                const item = document.createElement('div');
                item.className = 'property-item';
                item.innerHTML = `
                    <div class="property-label">气泡</div>
                    <div class="property-value">${bubbleMatch[1].trim()}</div>
                `;
                props.appendChild(item);
            }
            
            if (tempMatch) {
                const item = document.createElement('div');
                item.className = 'property-item';
                item.innerHTML = `
                    <div class="property-label">温度</div>
                    <div class="property-value">${tempMatch[1].trim()}</div>
                `;
                props.appendChild(item);
            }
            
            cardContent.appendChild(props);
        }
        
        // 8. 描述文案
        const descP = allP.find(p => {
            const text = p.textContent.trim();
            return text.length > 20 
                && text.length < 100
                && !text.includes('纳音')
                && !text.includes('五行')
                && !text.includes('气泡')
                && !text.includes('温度')
                && !text.includes('伴侣')
                && !text.includes('音乐')
                && !text.includes('💡');
        });
        if (descP) {
            const desc = document.createElement('p');
            desc.className = 'desc';
            desc.textContent = descP.textContent;
            cardContent.appendChild(desc);
        }
        
        // 9. 洞察
        const insightP = allP.find(p => p.textContent.includes('💡') || p.textContent.includes('建议'));
        if (insightP) {
            const insight = document.createElement('p');
            insight.className = 'insight';
            insight.textContent = insightP.textContent.replace('💡', '').trim();
            cardContent.appendChild(insight);
        }
        
        // 分隔线
        const divider3 = document.createElement('div');
        divider3.className = 'divider';
        cardContent.appendChild(divider3);
        
        // 10. 最佳伴侣
        const partnerH3 = h3s.find(h => h.textContent.includes('伴侣'));
        if (partnerH3) {
            const partnerSection = document.createElement('div');
            partnerSection.className = 'partner-section';
            
            // 找伴侣图片
            let nextEl = partnerH3.nextElementSibling;
            while (nextEl && nextEl.tagName !== 'IMG') {
                nextEl = nextEl.nextElementSibling;
            }
            if (nextEl && nextEl.tagName === 'IMG') {
                const partnerImg = document.createElement('img');
                partnerImg.src = nextEl.src;
                partnerImg.alt = nextEl.alt;
                partnerSection.appendChild(partnerImg);
            }
            
            // 伴侣信息
            const partnerInfo = document.createElement('div');
            partnerInfo.className = 'partner-info';
            
            // 找伴侣名称和纳音
            let nameEl = partnerH3.nextElementSibling;
            while (nameEl && nameEl.tagName !== 'P') {
                nameEl = nameEl.nextElementSibling;
            }
            if (nameEl) {
                const partnerName = document.createElement('div');
                partnerName.className = 'partner-name';
                partnerName.textContent = nameEl.textContent;
                partnerInfo.appendChild(partnerName);
                
                // 找伴侣纳音
                let nayinEl = nameEl.nextElementSibling;
                if (nayinEl && nayinEl.textContent.includes('纳音')) {
                    const partnerNayin = document.createElement('div');
                    partnerNayin.className = 'partner-nayin';
                    partnerNayin.textContent = nayinEl.textContent;
                    partnerInfo.appendChild(partnerNayin);
                }
            }
            
            partnerSection.appendChild(partnerInfo);
            cardContent.appendChild(partnerSection);
        }
        
        // 11. 本命音乐
        const musicH3 = h3s.find(h => h.textContent.includes('音乐'));
        if (musicH3) {
            let nextEl = musicH3.nextElementSibling;
            while (nextEl && nextEl.tagName !== 'P') {
                nextEl = nextEl.nextElementSibling;
            }
            if (nextEl) {
                const music = document.createElement('p');
                music.className = 'music';
                music.textContent = '🎵 ' + nextEl.textContent;
                cardContent.appendChild(music);
            }
        }
        
        // 底部
        const footer = document.createElement('div');
        footer.className = 'print-card-footer';
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
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 3000));
    } else {
        setTimeout(init, 3000);
    }
})();