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
        
        // 插入到页面底部
        const root = document.getElementById('root');
        if (root) {
            root.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
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
                        <span class="print-label">最佳伴侣</span>
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
                    background: #F7F5F0;
                    padding: 0.8cm;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .print-card-header {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 0.4cm;
                }
                
                .print-card-header img {
                    width: 3cm;
                    height: auto;
                    margin-bottom: 0.3cm;
                }
                
                .print-card-header h2 {
                    font-size: 22pt;
                    margin: 0 0 0.2cm 0;
                    font-weight: 600;
                    color: #333;
                    letter-spacing: 0.05em;
                }
                
                #print-nayin {
                    font-size: 11pt;
                    color: #666;
                    margin: 0 0 0.15cm 0;
                }
                
                #print-wuxing {
                    font-size: 10pt;
                    color: #888;
                    margin: 0;
                    letter-spacing: 0.1em;
                }
                
                .print-card-body {
                    width: 100%;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 0.5cm;
                }
                
                #print-desc {
                    font-size: 11pt;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0 0.3cm;
                }
                
                .print-partner {
                    border-top: 1px solid #ddd;
                    padding-top: 0.4cm;
                    margin-top: 0.2cm;
                }
                
                .print-label {
                    font-size: 9pt;
                    color: #999;
                    display: block;
                    margin-bottom: 0.2cm;
                    letter-spacing: 0.1em;
                }
                
                #print-partner-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.3cm;
                }
                
                #print-partner-content img {
                    width: 1.5cm;
                    height: auto;
                }
                
                #print-partner-content span {
                    font-size: 11pt;
                    color: #333;
                    font-weight: 500;
                }
                
                .print-card-footer {
                    font-size: 8pt;
                    color: #bbb;
                    margin-top: 0.3cm;
                    letter-spacing: 0.05em;
                }
                
                @page {
                    size: 10cm 14cm;
                    margin: 0;
                }
                
                /* 去掉浏览器默认页眉页脚 */
                @page :first {
                    margin-top: 0;
                }
                
                @page :left {
                    margin-left: 0;
                }
                
                @page :right {
                    margin-right: 0;
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
    
    // 抓取结果页数据 - 基于实际页面结构
    function extractResultData() {
        const data = {};
        const bodyText = document.body.innerText;
        
        // 饮品名称 - 找大标题
        const nameEl = document.querySelector('h1, h2, .text-2xl, .text-xl, [class*="title"]');
        if (nameEl) data.name = nameEl.textContent.trim();
        
        // 饮品图片 - 找页面里最大的图片
        const allImgs = Array.from(document.querySelectorAll('img'));
        // 优先找饮品相关图片（排除小图标）
        const drinkImg = allImgs.find(img => 
            (img.src.includes('drink') || img.src.includes('product') || img.width > 80) 
            && !img.src.includes('icon')
        );
        if (drinkImg) data.img = drinkImg.src;
        
        // 如果没找到，找第一个大图
        if (!data.img) {
            const largeImg = allImgs.find(img => img.width > 100 && img.height > 100);
            if (largeImg) data.img = largeImg.src;
        }
        
        // 纳音 - 从文本匹配
        const nayinMatch = bodyText.match(/纳音[：:]\s*([^\n]+)/);
        if (nayinMatch) data.nayin = nayinMatch[1].trim();
        
        // 五行分布 - 找五行相关文本（如"木1 火2 土5 水2"）
        const wuxingMatch = bodyText.match(/([木火土金水]\d+\s*)+/);
        if (wuxingMatch) {
            data.wuxing = wuxingMatch[0].trim();
        }
        
        // 描述文案 - 找较长的段落文本（排除已知的非描述文本）
        const paragraphs = Array.from(document.querySelectorAll('p, div, span'));
        const descEl = paragraphs.find(p => {
            const text = p.textContent.trim();
            return text.length > 15 
                && text.length < 150 
                && !text.includes('纳音')
                && !text.includes('五行')
                && !text.includes('伴侣')
                && !text.includes('气泡')
                && !text.includes('温度');
        });
        if (descEl) data.desc = descEl.textContent.trim();
        
        // 最佳伴侣 - 找包含"伴侣"或"合拍"的区域
        const allElements = Array.from(document.querySelectorAll('*'));
        const partnerSection = allElements.find(el => {
            const text = el.textContent;
            return (text.includes('最佳伴侣') || text.includes('合拍')) && el.children.length > 0;
        });
        
        if (partnerSection) {
            // 在伴侣区域内找图片和名称
            const partnerImgs = partnerSection.querySelectorAll('img');
            const partnerTexts = Array.from(partnerSection.querySelectorAll('span, h3, h4, p, div'));
            
            // 找第一个有 src 的图片
            const partnerImg = Array.from(partnerImgs).find(img => img.src && !img.src.includes('data:'));
            
            // 找伴侣名称（排除"最佳伴侣"标签本身）
            const partnerNameEl = partnerTexts.find(el => {
                const text = el.textContent.trim();
                return text.length > 0 && text.length < 20 && !text.includes('伴侣') && !text.includes('合拍');
            });
            
            data.partner = {
                img: partnerImg ? partnerImg.src : '',
                name: partnerNameEl ? partnerNameEl.textContent.trim() : ''
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