// ===== PROGRESS DASHBOARD - الإحصائيات المتقدمة =====

document.addEventListener('DOMContentLoaded', function() {
    // المتغيرات العامة
    let userProgress = null;
    let activityData = [];
    let currentChartInstances = {};
    let currentFilter = 'week';
    let activityPage = 1;
    const itemsPerPage = 10;

    // تهيئة الصفحة
    function initProgressDashboard() {
        loadUserData();
        loadProgressData();
        setupCharts();
        loadActivityData();
        setupEventListeners();
        updateOverviewCards();
        updatePerformanceAnalysis();
        updatePredictions();
        
        // إخفاء شاشة التحميل
        setTimeout(() => {
            document.getElementById('dataLoader').style.display = 'none';
        }, 1000);
    }

    // تحميل بيانات المستخدم
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            name: 'محمد',
            level: 'مبتدئ'
        };
        
        // تحديث معلومات المستخدم
        document.getElementById('progressUserName').textContent = `مرحباً، ${userData.name}`;
        document.getElementById('userLevel').textContent = userData.level;
    }

    // تحميل بيانات التقدم
    function loadProgressData() {
        // بيانات التقدم من localStorage أو افتراضية
        userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
            streakDays: 3,
            totalHours: 12,
            completedCourses: 2,
            completedVideos: 8,
            currentStreak: 3,
            bestStreak: 7,
            completionRate: 35,
            dailyAvgHours: 1.2,
            weeklyHours: 8.5,
            weeklyIncrease: 15,
            dailyCompletion: 4.2,
            estimatedCompletion: '٢ يوليو ٢٠٢٤',
            mostActiveDay: 'السبت',
            bestLearningTime: 'المساء',
            completionConfidence: 85,
            currentSkillLevel: 'مبتدئ',
            predictedSkillLevel: 'متوسط'
        };
        
        // تحديث الـ sidebar
        document.getElementById('sidebarStreak').textContent = userProgress.streakDays;
        document.getElementById('sidebarHours').textContent = userProgress.totalHours;
    }

    // إعداد الرسوم البيانية
    function setupCharts() {
        // تدمير الرسوم البيانية القديمة إذا كانت موجودة
        Object.values(currentChartInstances).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        currentChartInstances = {};
        
        // إنشاء الرسوم البيانية
        createWeeklyProgressChart();
        createTimeDistributionChart();
        createCompletionRateChart();
        createLearningHoursChart();
    }

    // رسم بياني للتقدم الأسبوعي
    function createWeeklyProgressChart() {
        const ctx = document.getElementById('weeklyProgressChart').getContext('2d');
        
        const data = {
            labels: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
            datasets: [{
                label: 'ساعات التعلم',
                data: [2.5, 1.2, 0.8, 1.5, 2.0, 0.5, 1.0],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
        
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} ساعات`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' س';
                            }
                        }
                    }
                }
            }
        };
        
        currentChartInstances.weeklyProgress = new Chart(ctx, config);
    }

    // رسم بياني لتوزيع الوقت
    function createTimeDistributionChart() {
        const ctx = document.getElementById('timeDistributionChart').getContext('2d');
        
        const data = {
            labels: ['المرحلة 1', 'المرحلة 2', 'المرحلة 3'],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: [
                    '#667eea',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };
        
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        };
        
        currentChartInstances.timeDistribution = new Chart(ctx, config);
    }

    // رسم بياني لمعدل الإنجاز
    function createCompletionRateChart() {
        const ctx = document.getElementById('completionRateChart').getContext('2d');
        
        const data = {
            labels: ['أسبوع 1', 'أسبوع 2', 'أسبوع 3', 'أسبوع 4'],
            datasets: [{
                label: 'معدل الإنجاز',
                data: [15, 25, 35, 45],
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        };
        
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y}% إنجاز`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        };
        
        currentChartInstances.completionRate = new Chart(ctx, config);
    }

    // رسم بياني لساعات التعلم
    function createLearningHoursChart() {
        const ctx = document.getElementById('learningHoursChart').getContext('2d');
        
        const data = {
            labels: ['6-8', '8-10', '10-12', '12-2', '2-4', '4-6', '6-8', '8-10'],
            datasets: [{
                label: 'ساعات التعلم',
                data: [0.5, 1.2, 0.8, 0.3, 1.5, 2.0, 1.8, 0.9],
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: '#f59e0b',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} ساعات`;
                            },
                            title: function(tooltipItems) {
                                return `من ${tooltipItems[0].label} ص`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' س';
                            }
                        }
                    }
                }
            }
        };
        
        currentChartInstances.learningHours = new Chart(ctx, config);
    }

    // تحديث بطاقات النظرة السريعة
    function updateOverviewCards() {
        document.getElementById('completionRate').textContent = `${userProgress.completionRate}%`;
        document.getElementById('currentStreak').textContent = userProgress.currentStreak;
        document.getElementById('totalLearningTime').textContent = userProgress.totalHours;
        document.getElementById('completedItems').textContent = userProgress.completedVideos;
        
        // تحديث شريط التقدم
        document.querySelector('#completionRate + .overview-progress .progress-fill').style.width = `${userProgress.completionRate}%`;
        
        // تحديث إحصائيات الأسبوع
        document.getElementById('weeklyHours').textContent = userProgress.weeklyHours;
        document.querySelector('.positive').textContent = `+${userProgress.weeklyIncrease}%`;
        document.getElementById('dailyCompletion').textContent = `${userProgress.dailyCompletion}%`;
        document.getElementById('estimatedCompletion').textContent = userProgress.estimatedCompletion;
        document.getElementById('mostActiveDay').textContent = userProgress.mostActiveDay;
        document.getElementById('bestLearningTime').textContent = userProgress.bestLearningTime;
    }

    // تحليل الأداء
    function updatePerformanceAnalysis() {
        // نقاط القوة (يمكن جلبها من localStorage)
        const strengths = JSON.parse(localStorage.getItem('userStrengths')) || [
            'الالتزام بالتعلم اليومي',
            'سرعة استيعاب المفاهيم الجديدة',
            'إكمال التمارين العملية بكفاءة'
        ];
        
        // تحديث قائمة نقاط القوة
        const strengthsList = document.getElementById('strengthsList');
        strengthsList.innerHTML = strengths.map(strength => `
            <li>
                <i class="fas fa-check-circle"></i>
                <span>${strength}</span>
            </li>
        `).join('');
        
        // مجالات التحسين
        const improvements = JSON.parse(localStorage.getItem('userImprovements')) || [
            'تنظيم وقت التعلم بشكل أفضل',
            'مراجعة الدروس السابقة بانتظام',
            'زيادة التركيز أثناء التعلم'
        ];
        
        const improvementsList = document.getElementById('improvementsList');
        improvementsList.innerHTML = improvements.map(improvement => `
            <li>
                <i class="fas fa-exclamation-circle"></i>
                <span>${improvement}</span>
            </li>
        `).join('');
        
        // التوصيات
        const recommendations = JSON.parse(localStorage.getItem('userRecommendations')) || [
            'ابدأ مشروعاً عملياً لتطبيق ما تعلمته',
            'شارك معرفتك مع الآخرين لتعزيز التعلم',
            'جرب تقنية بومودورو لزيادة الإنتاجية'
        ];
        
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = recommendations.map(recommendation => `
            <li>
                <i class="fas fa-bullseye"></i>
                <span>${recommendation}</span>
            </li>
        `).join('');
    }

    // تحديث التوقعات
    function updatePredictions() {
        document.getElementById('predictedCompletionDate').textContent = userProgress.estimatedCompletion;
        document.getElementById('completionConfidence').textContent = `ثقة ${userProgress.completionConfidence}%`;
        document.getElementById('currentSkillLevel').textContent = userProgress.currentSkillLevel;
        document.getElementById('predictedSkillLevel').textContent = userProgress.predictedSkillLevel;
        
        // تحديث شريط المهارة
        const skillPercentage = userProgress.completionConfidence;
        document.querySelector('.meter-fill').style.width = `${skillPercentage}%`;
    }

    // تحميل بيانات النشاط
    function loadActivityData() {
        // بيانات النشاط الافتراضية
        activityData = [
            { date: 'اليوم، 10:30 ص', activity: 'أكملت درس "مقدمة إلى HTML"', duration: '30:15', completion: '100%', score: '95%', type: 'video' },
            { date: 'أمس، 3:45 م', activity: 'بدأت درس "أساسيات CSS"', duration: '45:30', completion: '60%', score: '-', type: 'video' },
            { date: 'أمس، 11:20 ص', activity: 'حلقت تمرين HTML العملي', duration: '25:10', completion: '100%', score: '88%', type: 'exercise' },
            { date: 'قبل يومين، 2:15 م', activity: 'شاركت في مناقشة المجتمع', duration: '15:30', completion: '-', score: '-', type: 'community' },
            { date: 'قبل يومين، 9:40 ص', activity: 'راجعت ملاحظات الدرس الأول', duration: '20:00', completion: '-', score: '-', type: 'review' },
            { date: 'قبل 3 أيام، 4:20 م', activity: 'أكملت كورس "Git الأساسي"', duration: '1:20:00', completion: '100%', score: '92%', type: 'course' },
            { date: 'قبل 3 أيام، 10:15 ص', activity: 'اختبرت معلوماتك في HTML', duration: '15:00', completion: '100%', score: '85%', type: 'quiz' },
            { date: 'قبل 4 أيام، 6:30 م', activity: 'شاهدت درس "التصميم المتجاوب"', duration: '42:30', completion: '80%', score: '-', type: 'video' },
            { date: 'قبل 4 أيام، 1:45 م', activity: 'أضفت ملاحظات جديدة', duration: '10:00', completion: '-', score: '-', type: 'notes' },
            { date: 'قبل 5 أيام، 8:20 ص', activity: 'بدأت مشروع عملي جديد', duration: '45:00', completion: '40%', score: '-', type: 'project' }
        ];
        
        updateActivityTable();
    }

    // تحديث جدول النشاط
    function updateActivityTable() {
        const startIndex = (activityPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = activityData.slice(startIndex, endIndex);
        
        const tableBody = document.getElementById('activityTableBody');
        
        tableBody.innerHTML = pageData.map(item => `
            <tr>
                <td>
                    <div class="activity-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${item.date}</span>
                    </div>
                </td>
                <td>
                    <div class="activity-info">
                        <div class="activity-type ${item.type}">
                            <i class="${getActivityIcon(item.type)}"></i>
                        </div>
                        <span>${item.activity}</span>
                    </div>
                </td>
                <td>
                    <div class="activity-duration">
                        <i class="fas fa-clock"></i>
                        <span>${item.duration}</span>
                    </div>
                </td>
                <td>
                    <div class="activity-completion ${item.completion === '100%' ? 'completed' : ''}">
                        ${item.completion !== '-' ? `
                            <div class="completion-badge">${item.completion}</div>
                        ` : '<span class="no-data">-</span>'}
                    </div>
                </td>
                <td>
                    <div class="activity-score ${getScoreClass(item.score)}">
                        ${item.score !== '-' ? `
                            <div class="score-badge">${item.score}</div>
                        ` : '<span class="no-data">-</span>'}
                    </div>
                </td>
                <td>
                    <div class="activity-actions">
                        <button class="btn-action view" title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action repeat" title="إعادة">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // تحديث معلومات الصفحة
        updatePaginationInfo();
    }

    // الحصول على أيقونة النشاط
    function getActivityIcon(type) {
        const icons = {
            'video': 'fas fa-video',
            'exercise': 'fas fa-dumbbell',
            'community': 'fas fa-users',
            'review': 'fas fa-redo',
            'course': 'fas fa-graduation-cap',
            'quiz': 'fas fa-question-circle',
            'notes': 'fas fa-sticky-note',
            'project': 'fas fa-briefcase'
        };
        
        return icons[type] || 'fas fa-circle';
    }

    // الحصول على فئة النتيجة
    function getScoreClass(score) {
        if (score === '-') return '';
        const scoreValue = parseInt(score);
        if (scoreValue >= 90) return 'excellent';
        if (scoreValue >= 80) return 'good';
        if (scoreValue >= 70) return 'average';
        return 'poor';
    }

    // تحديث معلومات الصفحة
    function updatePaginationInfo() {
        const totalPages = Math.ceil(activityData.length / itemsPerPage);
        const startItem = (activityPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(activityPage * itemsPerPage, activityData.length);
        
        document.querySelector('.table-summary span').textContent = 
            `عرض ${startItem}-${endItem} من ${activityData.length} نشاط`;
        
        // تحديث أرقام الصفحات
        const pageNumbers = document.querySelector('.page-numbers');
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            const pageBtn = document.createElement('span');
            pageBtn.className = `page-number ${i === activityPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                activityPage = i;
                updateActivityTable();
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        // تحديث حالة أزرار التصفح
        document.getElementById('prevPage').disabled = activityPage === 1;
        document.getElementById('nextPage').disabled = activityPage === totalPages;
    }

    // تصفية البيانات حسب الفترة
    function filterDataByPeriod(period) {
        currentFilter = period;
        
        // تحديث أزرار التصفية
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.period === period) {
                btn.classList.add('active');
            }
        });
        
        // إعادة تحميل البيانات بناءً على الفترة
        // (في التطبيق الحقيقي، هنا ستجلب بيانات مختلفة من السيرفر)
        
        // إعادة رسم الرسوم البيانية
        setTimeout(() => {
            setupCharts();
            showNotification(`تم تطبيق تصفية ${getPeriodName(period)}`);
        }, 300);
    }

    // الحصول على اسم الفترة بالعربية
    function getPeriodName(period) {
        const names = {
            'week': 'أسبوع',
            'month': 'شهر',
            'year': 'سنة'
        };
        return names[period] || period;
    }

    // تصدير البيانات
    function exportData(format) {
        const period = document.getElementById('exportPeriod').value;
        
        showNotification(`جاري تصدير البيانات بصيغة ${format} للفترة: ${getPeriodName(period)}`);
        
        // محاكاة التصدير
        setTimeout(() => {
            showNotification('تم تصدير البيانات بنجاح ✓', 'success');
            document.getElementById('exportModal').classList.remove('show');
        }, 2000);
    }

    // إعداد مستمعي الأحداث
    function setupEventListeners() {
        // زر تسجيل الخروج
        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('هل تريد تسجيل الخروج؟')) {
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            }
        });
        
        // زر القائمة للموبايل
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                mobileToggle.innerHTML = sidebar.classList.contains('open') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }
        
        // تصفية الفترة الزمنية
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const period = this.dataset.period;
                filterDataByPeriod(period);
            });
        });
        
        // زر التصدير
        document.getElementById('exportBtn').addEventListener('click', function() {
            document.getElementById('exportModal').classList.add('show');
        });
        
        // إغلاق نافذة التصدير
        document.getElementById('closeExportModal').addEventListener('click', function() {
            document.getElementById('exportModal').classList.remove('show');
        });
        
        document.getElementById('cancelExport').addEventListener('click', function() {
            document.getElementById('exportModal').classList.remove('show');
        });
        
        // تأكيد التصدير
        document.getElementById('confirmExport').addEventListener('click', function() {
            const selectedFormat = document.querySelector('input[name="exportFormat"]:checked').id.replace('format', '').toLowerCase();
            exportData(selectedFormat);
        });
        
        // أزرار الصفحة التالية والسابقة
        document.getElementById('prevPage').addEventListener('click', function() {
            if (activityPage > 1) {
                activityPage--;
                updateActivityTable();
            }
        });
        
        document.getElementById('nextPage').addEventListener('click', function() {
            if (activityPage * itemsPerPage < activityData.length) {
                activityPage++;
                updateActivityTable();
            }
        });
        
        // زر إضافة أهداف
        document.getElementById('setGoalsBtn').addEventListener('click', function() {
            showNotification('قريباً: ستتمكن من إضافة أهدافك الشخصية!', 'info');
        });
        
        // زر تصفية النشاط
        document.getElementById('activityFilter').addEventListener('click', function() {
            showNotification('جاري تطبيق التصفية...', 'info');
        });
        
        // زر إعادة تعيين
        document.getElementById('clearFilter').addEventListener('click', function() {
            activityPage = 1;
            updateActivityTable();
            showNotification('تم إعادة تعيين التصفية', 'success');
        });
        
        // تحديث حجم الرسوم البيانية عند تغيير حجم النافذة
        window.addEventListener('resize', function() {
            setTimeout(setupCharts, 300);
        });
        
        // حفظ التقدم عند مغادرة الصفحة
        window.addEventListener('beforeunload', function() {
            saveProgressData();
        });
        
        // تحديث الرسوم البيانية عند تغيير التبويب
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(setupCharts, 300);
            }
        });
    }

    // حفظ بيانات التقدم
    function saveProgressData() {
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
    }

    // إظهار إشعار
    function showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار إذا لم يكن موجوداً
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // إعداد الإشعار
        let icon = 'info-circle';
        switch(type) {
            case 'success': icon = 'check-circle'; break;
            case 'warning': icon = 'exclamation-triangle'; break;
            case 'error': icon = 'times-circle'; break;
        }
        
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.classList.add('show');
        
        // إخفاء الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // توليد بيانات عشوائية للاختبار
    function generateMockData() {
        const mockData = {
            // بيانات الأسبوع
            weeklyData: Array.from({length: 7}, () => Math.random() * 3),
            
            // توزيع الوقت
            timeDistribution: [
                { label: 'المرحلة 1', value: 60 },
                { label: 'المرحلة 2', value: 25 },
                { label: 'المرحلة 3', value: 15 }
            ],
            
            // معدل الإنجاز
            completionRates: [15, 25, 35, 45],
            
            // ساعات التعلم اليومية
            dailyHours: Array.from({length: 8}, () => Math.random() * 2.5)
        };
        
        return mockData;
    }

    // تحديث البيانات كل 30 ثانية (محاكاة تحديث حي)
    function startLiveUpdates() {
        setInterval(() => {
            if (!document.hidden) {
                // تحديث البيانات العشوائية للعرض التوضيحي
                const mockData = generateMockData();
                
                // تحديث الرسوم البيانية
                if (currentChartInstances.weeklyProgress) {
                    currentChartInstances.weeklyProgress.data.datasets[0].data = mockData.weeklyData;
                    currentChartInstances.weeklyProgress.update('none');
                }
                
                if (currentChartInstances.learningHours) {
                    currentChartInstances.learningHours.data.datasets[0].data = mockData.dailyHours;
                    currentChartInstances.learningHours.update('none');
                }
                
                // تحديث بعض الإحصائيات
                const randomIncrease = Math.floor(Math.random() * 30) - 10;
                document.querySelector('.positive').textContent = `${randomIncrease > 0 ? '+' : ''}${randomIncrease}%`;
            }
        }, 30000); // كل 30 ثانية
    }

    // البدء
    initProgressDashboard();
    startLiveUpdates();
    
    // تحسين الأداء
    window.addEventListener('load', function() {
        // Lazy load للرسوم البيانية
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(setupCharts, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        const chartsSection = document.querySelector('.charts-section');
        if (chartsSection) {
            observer.observe(chartsSection);
        }
    });
});