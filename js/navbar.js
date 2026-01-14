// ملف: js/navbar.js

class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.loadNavbar();
        this.setupEventListeners();
        this.updateActiveLink();
        this.loadUserData();
        this.setupLogout();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    }

    loadNavbar() {
        // تحميل navbar إذا لم يكن موجوداً
        if (!document.getElementById('mainNav')) {
            fetch('components/navbar.html')
                .then(response => response.text())
                .then(html => {
                    document.body.insertAdjacentHTML('afterbegin', html);
                    this.setupEventListeners();
                    this.updateActiveLink();
                    this.loadUserData();
                })
                .catch(error => {
                    console.error('Error loading navbar:', error);
                    this.createFallbackNavbar();
                });
        }
    }

    createFallbackNavbar() {
        const fallbackNav = `
            <nav style="background:#667eea;padding:15px;color:white;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <a href="index.html" style="color:white;text-decoration:none;font-weight:bold;">
                        <i class="fas fa-route"></i> مسار
                    </a>
                    <div>
                        <a href="dashboard.html" style="color:white;margin:0 10px;">لوحتي</a>
                        <a href="profile.html" style="color:white;margin:0 10px;">ملفي</a>
                    </div>
                </div>
            </nav>
        `;
        document.body.insertAdjacentHTML('afterbegin', fallbackNav);
    }

    setupEventListeners() {
        // زر القائمة للموبايل
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }

        // Dropdown المستخدم
        const userToggle = document.getElementById('userToggle');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userToggle) {
            userToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userToggle.parentElement.classList.toggle('active');
            });

            // إغلاق Dropdown عند النقر خارجها
            document.addEventListener('click', (e) => {
                if (!userToggle.contains(e.target) && !userDropdown?.contains(e.target)) {
                    userToggle.parentElement.classList.remove('active');
                }
            });
        }

        // زر الإشعارات
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    updateActiveLink() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')) || 
                        JSON.parse(localStorage.getItem('masarUser')) ||
                        { name: 'مستخدم' };
        
        const userNameElement = document.getElementById('userNameNav');
        if (userNameElement && userData.name) {
            userNameElement.textContent = userData.name;
        }
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل تريد تسجيل الخروج؟')) {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('masarUser');
                    localStorage.removeItem('currentStep');
                    localStorage.removeItem('learningPath');
                    
                    // إعادة التوجيه للصفحة الرئيسية
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 500);
                }
            });
        }
    }

    showNotifications() {
        // هنا يمكن إضافة نافذة الإشعارات
        alert('نظام الإشعارات قيد التطوير...');
    }

    // دالة للمساعدة في التنقل بين الصفحات
    navigateTo(page, data = {}) {
        // حفظ البيانات إذا وجدت
        if (Object.keys(data).length > 0) {
            localStorage.setItem('navigationData', JSON.stringify(data));
        }
        
        // إضافة أنيميشن قبل الانتقال
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = page;
        }, 300);
    }

    // دالة للحصول على البيانات المرسلة بين الصفحات
    getNavigationData() {
        const data = localStorage.getItem('navigationData');
        if (data) {
            const parsed = JSON.parse(data);
            localStorage.removeItem('navigationData');
            return parsed;
        }
        return null;
    }
}

// تهيئة Navigation Manager عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.navManager = new NavigationManager();
    
    // تحميل الأنماط إذا لم تكن موجودة
    if (!document.querySelector('link[href*="navbar.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/navbar.css';
        document.head.appendChild(link);
    }
});

// دالة مساعدة للتحقق من تسجيل الدخول
function checkAuth() {
    const userData = localStorage.getItem('userData') || localStorage.getItem('masarUser');
    if (!userData && !window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('onboarding.html')) {
        window.location.href = 'index.html';
    }
}

// استدعاء التحقق عند تحميل كل صفحة
checkAuth();