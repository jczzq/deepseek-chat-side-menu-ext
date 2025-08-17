// DeepSeek 问题侧边栏内容脚本
class DeepSeekSidebar {
  constructor() {
    this.no = 0;
    this.questions = [];
    this.sidebar = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    // 监听消息变化
    this.observeMessages();
    // 创建侧边栏
    this.createSidebar();
    // 添加切换按钮
    // this.addToggleButton();
  }

  createSidebar() {
    // 创建侧边栏容器
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'deepseek-sidebar';
    this.sidebar.className = 'deepseek-sidebar';

    // 创建侧边栏内容
    this.sidebar.innerHTML = `
      <div class="sidebar-content">
        <div class="questions-list" id="questions-list">
          <div class="no-questions">载入中...</div>
        </div>
      </div>
    `;

    // 添加到页面
    document.body.appendChild(this.sidebar);

    // 绑定事件
    this.bindEvents();
  }

  addToggleButton() {
    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebar-toggle';
    toggleBtn.className = 'sidebar-toggle-btn';
    toggleBtn.innerHTML = '📋';
    toggleBtn.title = '显示/隐藏问题侧边栏';

    // 添加到页面
    document.body.appendChild(toggleBtn);

    // 绑定点击事件
    toggleBtn.addEventListener('click', () => {
      this.toggleSidebar();
    });
  }

  bindEvents() {
    // 关闭按钮
    // document.getElementById('close-sidebar').addEventListener('click', () => {
    //   this.hideSidebar();
    // });
    // 点击外部关闭
    // document.addEventListener('click', (e) => {
    //   if (
    //     this.isVisible &&
    //     !this.sidebar.contains(e.target) &&
    //     !document.getElementById('sidebar-toggle').contains(e.target)
    //   ) {
    //     this.hideSidebar();
    //   }
    // });
  }

  observeMessages() {
    const dc04ec1d = document.querySelector('.dc04ec1d');

    if (!dc04ec1d) {
      setTimeout(() => {
        this.observeMessages();
      }, 100);
      return;
    }
    this.detectNewQuestion();

    dc04ec1d.addEventListener('click', (e) => {
      const classList = e.target?.classList || [];
      if (classList.contains('c08e6e93') || classList.contains('_83421f9')) {
        setTimeout(() => {
          this.detectNewQuestion();
        }, 100);
      }
    });
  }

  detectNewQuestion() {
    const parent = document.querySelector('.dad65929');
    if (!parent) {
      setTimeout(() => {
        this.detectNewQuestion();
      }, 100);
      return;
    }
    const userMessages = parent.querySelectorAll('._9663006');
    this.questions = [];

    if (!userMessages?.length) return;

    userMessages.forEach((message) => {
      const domId = 'title' + ++this.no;

      const textElement = message.querySelector('.fbb737a4');
      textElement.classList.add(domId);

      const questionText = textElement && textElement.textContent.trim();

      const question = {
        domId,
        text: questionText,
      };

      this.questions.push(question);
      this.updateSidebar();
    });
  }

  updateSidebar() {
    const questionsList = document.getElementById('questions-list');

    if (this.questions.length === 0) {
      questionsList.innerHTML = '<div class="no-questions">暂无问题记录</div>';
      return;
    }

    questionsList.innerHTML = this.questions
      .map(
        (question) => `
      <div class="question-item" data-id="${question.domId}">
        <div class="question-text">${this.truncateText(
          question.text,
          100
        )}</div>
      </div>
    `
      )
      .join('');

    // 绑定问题项事件
    this.bindQuestionEvents();
  }

  bindQuestionEvents() {
    // 点击问题项
    document.querySelectorAll('.question-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const questionId = item.dataset.id;
        const questionEl = document.querySelector(`.${questionId}`);

        if (questionEl) {
          // 跳转到当前问题
          questionEl.scrollIntoView();
          // navigator.clipboard.writeText(question.text);
          // this.showToast('问题已复制到剪贴板');
        }
      });
    });
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  showToast(message) {
    // 创建提示消息
    const toast = document.createElement('div');
    toast.className = 'sidebar-toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // 自动移除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 2000);
  }

  toggleSidebar() {
    if (this.isVisible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  showSidebar() {
    this.sidebar.classList.add('visible');
    this.isVisible = true;
  }

  hideSidebar() {
    this.sidebar.classList.remove('visible');
    this.isVisible = false;
  }

  clearQuestions() {
    this.questions = [];
    this.updateSidebar();
    this.showToast('问题历史已清空');
  }
}

// 监听来自弹窗的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidebar') {
    // 查找侧边栏实例并切换显示状态
    const sidebar = window.deepseekSidebar;
    if (sidebar) {
      sidebar.toggleSidebar();
    }
    sendResponse({ success: true });
  }
});

// 初始化侧边栏
window.deepseekSidebar = new DeepSeekSidebar();
