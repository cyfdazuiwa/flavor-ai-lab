// 打印卡片功能 - 14cm x 10cm 竖版小卡片
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
    
    // 添加打印样式
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
                    background: #F7F5F0;
                    margin: 0; padding: 0;
                    overflow: hidden;
                }
                
                .print-card-content {
                    width: 10cm;
                    height: 14cm;
                    margin: 0 auto;
                    background: #F7F5F0;
                    padding: 0.4cm 0.5cm;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .print-card-content img.drink-img {
                    width: 2cm;
                    height: auto;
                    margin-bottom: 0.15cm;
                }
                
                .print-card-content h1 {
                    font-size: 16pt !important;
                    margin: 0 0 0.1cm 0 !important;
                    font-weight: 600;
                    color: #333;
                }
                
                .print-card-content .nayin {
                    font-size: 9pt;
                    color: #666;
                    margin: 0 0 0.05cm 0;
                }
                
                .print-card-content .wuxing {
                    font-size: 8pt;
                    color: #888;
                    margin: 0 0 0.15cm 0;
                }
                
                .print-card-content h3 {
                    font-size: 8pt !important;
                    color: #999;
                    margin: 0.1cm 0 0.05cm 0 !important;
                    font-weight: 500;
                }
                
                .print-card-content .radar-img {
                    max-width: 2.5cm !important;
                    max-height: 2.5cm !important;
                    margin: 0.05cm 0;
                }
                
                .print-card-content .properties {
                    font-size: 8pt;
                    color: #666;
                    margin: 0.05cm 0;
                }
                
                .print-card-content .desc {
                    font-size: 8pt;
                    line-height: 1.4;
                    color: #333;
                    margin: 0.1cm 0;
                    padding: 0 0.2cm;
                }
                
                .print-card-content .insight {
                    font-size: 7pt;
                    line-height: 1.3;
                    color: #888;
                    margin: 0.1cm 0;
                    padding: 0 0.2cm;
                    font-style: italic;
                }
                
                .print-card-content .partner-section {
                    border-top: 1px solid #ddd;
                    padding-top: 0.15cm;
                    margin-top: 0.1cm;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.2cm;
                }
                
                .print-card-content .partner-section img {
                    width: 0.8cm;
                    height: auto;
                }
                
                .print-card-content .partner-section span {
                    font-size: 8pt;
                    color: #333;
                }
                
                .print-card-content .music {
                    font-size: 7pt;
                    color: #aaa;
                    margin-top: 0.1cm;
                }
                
                .print-card-footer {
                    font-size: 6pt;
                    color: #bbb;
                    margin-top: auto;
                    padding-top: 0.15cm;
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
        
        // 获取原页面所有元素
        const root = document.getElementById('root');
        if (!root) {
            console.error('Root not found');
            return;
        }
        
        // 获取所有直接子元素
        const allElements = Array.from(root.querySelectorAll('*'));
        console.log('Total elements:', allElements.length);
        
        // 1. 饮品图片 - 找第一个大图（产品图）
        const drinkImg = root.querySelector('img[alt]');
        if (drinkImg) {
            console.log('Found drink img:', drinkImg.alt);
            const img = document.createElement('img');
            img.src = drinkImg.src;
            img.alt = drinkImg.alt;
            img.className = 'drink-img';
            cardContent.appendChild(img);
        }
        
        // 2. 饮品名称 - h1
        const h1 = root.querySelector('h1');
        if (h1) {
            console.log('Found h1:', h1.textContent);
            const name = document.createElement('h1');
            name.textContent = h1.textContent;
            cardContent.appendChild(name);
        }
        
        // 3. 纳音 - 包含"纳音"的 p
        const allP = Array.from(root.querySelectorAll('p'));
        const nayinP = allP.find(p => p.textContent.includes('纳音'));
        if (nayinP) {
            console.log('Found nayin:', nayinP.textContent);
            const nayin = document.createElement('p');
            nayin.className = 'nayin';
            nayin.textContent = nayinP.textContent;
            cardContent.appendChild(nayin);
        }
        
        // 4. 五行分布 - 包含数字的 p（如"木7 火1 水2"）
        const wuxingP = allP.find(p => /[木火土金水]\d/.test(p.textContent));
        if (wuxingP) {
            console.log('Found wuxing:', wuxingP.textContent);
            const wuxing = document.createElement('p');
            wuxing.className = 'wuxing';
            wuxing.textContent = wuxingP.textContent;
            cardContent.appendChild(wuxing);
        }
        
        // 5. 五行属性分布标题 + 雷达图
        const h3s = Array.from(root.querySelectorAll('h3'));
        const wuxingH3 = h3s.find(h => h.textContent.includes('五行'));
        if (wuxingH3) {
            const title = document.createElement('h3');
            title.textContent = wuxingH3.textContent;
            cardContent.appendChild(title);
        }
        
        // 雷达图 - 找 svg 或 canvas
        const radar = root.querySelector('svg, canvas');
        if (radar) {
            console.log('Found radar');
            const radarClone = radar.cloneNode(true);
            radarClone.className = 'radar-img';
            radarClone.style.maxWidth = '2.5cm';
            radarClone.style.maxHeight = '2.5cm';
            cardContent.appendChild(radarClone);
        }
        
        // 6. 气泡温度 - 找包含"气泡"或"温度"的元素
        const bubbleP = allP.find(p => p.textContent.includes('气泡') || p.textContent.includes('温度'));
        if (bubbleP) {
            const props = document.createElement('p');
            props.className = 'properties';
            // 找相邻的文本
            const nextText = bubbleP.nextElementSibling;
            if (nextText) {
                props.textContent = bubbleP.textContent + '：' + nextText.textContent;
            } else {
                props.textContent = bubbleP.textContent;
            }
            cardContent.appendChild(props);
        }
        
        // 7. 描述文案 - 较长的 p（不含纳音、五行、气泡等）
        const descP = allP.find(p => {
            const text = p.textContent.trim();
            return text.length > 20 
                && text.length < 100
                && !text.includes('纳音')
                && !text.includes('五行')
                && !text.includes('气泡')
                && !text.includes('温度')
                && !text.includes('伴侣')
                && !text.includes('音乐');
        });
        if (descP) {
            console.log('Found desc:', descP.textContent.substring(0, 50));
            const desc = document.createElement('p');
            desc.className = 'desc';
            desc.textContent = descP.textContent;
            cardContent.appendChild(desc);
        }
        
        // 8. 洞察文案 - 包含"💡"或"建议"
        const insightP = allP.find(p => p.textContent.includes('💡') || p.textContent.includes('建议'));
        if (insightP) {
            console.log('Found insight:', insightP.textContent.substring(0, 50));
            const insight = document.createElement('p');
            insight.className = 'insight';
            insight.textContent = insightP.textContent.replace('💡', '');
            cardContent.appendChild(insight);
        }
        
        // 9. 最佳伴侣
        const partnerH3 = h3s.find(h => h.textContent.includes('伴侣'));
        if (partnerH3) {
            const partnerSection = document.createElement('div');
            partnerSection.className = 'partner-section';
            
            // 找伴侣图片（在最佳伴侣标题后面的 img）
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
            
            // 找伴侣名称
            let nameEl = partnerH3.nextElementSibling;
            while (nameEl && nameEl.tagName !== 'P') {
                nameEl = nameEl.nextElementSibling;
            }
            if (nameEl) {
                const partnerName = document.createElement('span');
                partnerName.textContent = nameEl.textContent;
                partnerSection.appendChild(partnerName);
            }
            
            cardContent.appendChild(partnerSection);
        }
        
        // 10. 本命音乐
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