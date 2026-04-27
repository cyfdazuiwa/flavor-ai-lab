// 打印卡片功能 - 14cm x 10cm 竖版小卡片
(function() {
    'use strict';
    
    console.log('Print card script loading...');
    
    // 创建打印按钮
    function createPrintButton() {
        const btn = document.createElement('button');
        btn.id = 'print-card-btn';
        btn.innerHTML = '🖨️ 打印卡片';
        btn.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9998;
            background: #333;
            color: #fff;
            border: none;
            border-radius: 24px;
            padding: 12px 24px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: none;
        `;
        btn.onclick = printCard;
        document.body.appendChild(btn);
        return btn;
    }
    
    // 创建打印卡片容器
    function createPrintCard() {
        const card = document.createElement('div');
        card.id = 'print-card-container';
        card.className = 'print-only';
        card.innerHTML = `
            <div class="print-card-inner">
                <div class="print-card-header">
                    <img id="print-drink-img" src="" alt="">
                    <h2 id="print-drink-name"></h2>
                    <p id="print-nayin"></p>
                    <div id="print-wuxing"></div>
                </div>
                <div class="print-card-body">
                    <p id="print-desc"></p>
                    <div class="print-partner">
                        <span class="print-label">💕 最佳伴侣</span>
                        <div id="print-partner-content"></div>
                    </div>
                </div>
                <div class="print-card-footer">五行纳音 · 本命饮品</div>
            </div>
        `;
        document.body.appendChild(card);
        return card;
    }
    
    // 添加打印样式
    function addPrintStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .print-only { display: none !important; }
            
            @media print {
                body > *:not(.print-only) { display: none !important; }
                
                .print-only {
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    background: #f5f5f0;
                    margin: 0; padding: 0;
                }
                
                .print-card-inner {
                    width: 10cm;
                    height: 14cm;
                    background: #fff;
                    padding: 1cm;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .print-card-header {
                    text-align: center;
                    margin-bottom: 0.5cm;
                }
                
                .print-card-header img {
                    width: 2.2cm;
                    height: auto;
                    margin-bottom: 0.2cm;
                }
                
                .print-card-header h2 {
                    font-size: 16pt;
                    margin: 0 0 0.15cm 0;
                    font-weight: 600;
                    color: #333;
                }
                
                #print-nayin {
                    font-size: 9pt;
                    color: #666;
                    margin: 0 0 0.2cm 0;
                }
                
                #print-wuxing {
                    font-size: 8pt;
                    color: #888;
                    margin: 0;
                }
                
                .print-card-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4cm;
                }
                
                #print-desc {
                    font-size: 9pt;
                    line-height: 1.5;
                    color: #333;
                    margin: 0;
                }
                
                .print-partner {
                    border-top: 1px solid #eee;
                    padding-top: 0.3cm;
                }
                
                .print-label {
                    font-size: 8pt;
                    color: #999;
                    display: block;
                    margin-bottom: 0.15cm;
                }
                
                #print-partner-content {
                    display: flex;
                    align-items: center;
                    gap: 0.3cm;
                }
                
                #print-partner-content img {
                    width: 1cm;
                    height: auto;
                }
                
                #print-partner-content span {
                    font-size: 9pt;
                    color: #333;
                }
                
                .print-card-footer {
                    text-align: center;
                    font-size: 7pt;
                    color: #bbb;
                    margin-top: 0.3cm;
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
    
    // 抓取结果页数据
    function extractResultData() {
        const data = {};
        
        // 饮品名称 - 尝试多种选择器
        const nameEl = document.querySelector('h1, h2, [class*="drink"], [class*="name"]');
        if (nameEl) data.name = nameEl.textContent.trim();
        
        // 饮品图片
        const imgEl = document.querySelector('img[src*="drink"], img[src*="product"], .result img, [class*="result"] img');
        if (imgEl) data.img = imgEl.src;
        
        // 纳音
        const nayinMatch = document.body.innerText.match(/纳音[：:]\s*(.+)/);
        if (nayinMatch) data.nayin = nayinMatch[1].trim();
        
        // 五行
        const wuxingMatch = document.body.innerText.match(/五行[：:]\s*(.+)/);
        if (wuxingMatch) data.wuxing = wuxingMatch[1].trim();
        
        // 描述文案
        const descEl = document.querySelector('[class*="desc"], [class*="description"], p');
        if (descEl) data.desc = descEl.textContent.trim();
        
        // 最佳伴侣
        const partnerSection = document.querySelector('[class*="partner"], [class*="match"]');
        if (partnerSection) {
            const partnerImg = partnerSection.querySelector('img');
            const partnerName = partnerSection.querySelector('span, h3, h4, p');
            data.partner = {
                img: partnerImg ? partnerImg.src : '',
                name: partnerName ? partnerName.textContent.trim() : ''
            };
        }
        
        console.log('Extracted data:', data);
        return data;
    }
    
    // 填充打印卡片
    function fillPrintCard(data) {
        const img = document.getElementById('print-drink-img');
        const name = document.getElementById('print-drink-name');
        const nayin = document.getElementById('print-nayin');
        const wuxing = document.getElementById('print-wuxing');
        const desc = document.getElementById('print-desc');
        const partnerContent = document.getElementById('print-partner-content');
        
        if (img && data.img) img.src = data.img;
        if (name && data.name) name.textContent = data.name;
        if (nayin && data.nayin) nayin.textContent = '纳音：' + data.nayin;
        if (wuxing && data.wuxing) wuxing.textContent = '五行：' + data.wuxing;
        if (desc && data.desc) desc.textContent = data.desc;
        
        if (partnerContent && data.partner) {
            partnerContent.innerHTML = '';
            if (data.partner.img) {
                const img = document.createElement('img');
                img.src = data.partner.img;
                partnerContent.appendChild(img);
            }
            if (data.partner.name) {
                const span = document.createElement('span');
                span.textContent = data.partner.name;
                partnerContent.appendChild(span);
            }
        }
    }
    
    // 打印卡片
    function printCard() {
        const data = extractResultData();
        if (!data.name) {
            alert('未检测到结果内容，请确保在结果页');
            return;
        }
        fillPrintCard(data);
        window.print();
    }
    
    // 初始化
    function init() {
        console.log('Initializing print card...');
        
        addPrintStyles();
        createPrintCard();
        const btn = createPrintButton();
        
        // 监听页面变化，检测是否在结果页
        const observer = new MutationObserver(() => {
            if (isResultPage()) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
        
        observer.observe(document.body, { subtree: true, childList: true });
        
        // 初始检查
        if (isResultPage()) {
            btn.style.display = 'block';
        }
        
        console.log('Print card initialized');
    }
    
    // 延迟初始化，等待 React 渲染
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 3000));
    } else {
        setTimeout(init, 3000);
    }
})();