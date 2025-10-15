import { browser, by, element } from 'protractor';

describe('Task Management App', () => {
  beforeEach(() => {
    browser.get('/');
  });

  describe('Authentication Flow', () => {
    it('should redirect to login page when not authenticated', () => {
      expect(browser.getCurrentUrl()).toContain('/login');
    });

    it('should login with valid credentials', () => {
      element(by.css('input[formControlName="username"]')).sendKeys('admin');
      element(by.css('input[formControlName="password"]')).sendKeys('admin123');
      element(by.css('button[type="submit"]')).click();

      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should show error for invalid credentials', () => {
      element(by.css('input[formControlName="username"]')).sendKeys('invalid');
      element(by.css('input[formControlName="password"]')).sendKeys('invalid');
      element(by.css('button[type="submit"]')).click();

      browser.waitForAngular();
      expect(element(by.css('.error-message')).isDisplayed()).toBeTruthy();
    });
  });

  describe('Dashboard', () => {
    beforeEach(() => {
      // Login first
      element(by.css('input[formControlName="username"]')).sendKeys('admin');
      element(by.css('input[formControlName="password"]')).sendKeys('admin123');
      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();
    });

    it('should display dashboard after login', () => {
      expect(browser.getCurrentUrl()).toContain('/dashboard');
      expect(element(by.css('h2')).getText()).toContain('Dashboard');
    });

    it('should show project summaries', () => {
      expect(element(by.css('.project-summary')).isPresent()).toBeTruthy();
    });
  });

  describe('Task Management', () => {
    beforeEach(() => {
      // Login first
      element(by.css('input[formControlName="username"]')).sendKeys('admin');
      element(by.css('input[formControlName="password"]')).sendKeys('admin123');
      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();
    });

    it('should navigate to tasks page', () => {
      element(by.css('a[routerLink="/tasks"]')).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/tasks');
    });

    it('should create a new task', () => {
      element(by.css('a[routerLink="/tasks"]')).click();
      browser.waitForAngular();

      element(by.css('button:contains("Add Task")')).click();
      browser.waitForAngular();

      element(by.css('input[formControlName="title"]')).sendKeys('E2E Test Task');
      element(by.css('textarea[formControlName="description"]')).sendKeys('E2E Test Description');
      element(by.css('input[formControlName="dueDate"]')).sendKeys('2024-12-31');
      element(by.css('select[formControlName="priority"]')).element(by.css('option[value="high"]')).click();

      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();

      expect(element(by.css('.task-item')).isPresent()).toBeTruthy();
    });

    it('should update task status', () => {
      element(by.css('a[routerLink="/tasks"]')).click();
      browser.waitForAngular();

      const statusSelect = element(by.css('select[formControlName="status"]')).first();
      statusSelect.element(by.css('option[value="in_progress"]')).click();
      browser.waitForAngular();

      expect(statusSelect.getAttribute('value')).toBe('in_progress');
    });

    it('should filter tasks by status', () => {
      element(by.css('a[routerLink="/tasks"]')).click();
      browser.waitForAngular();

      element(by.css('select[formControlName="status"]')).element(by.css('option[value="not_started"]')).click();
      browser.waitForAngular();

      // Check that only not started tasks are visible
      const taskItems = element.all(by.css('.task-item'));
      taskItems.each(task => {
        expect(task.element(by.css('select[formControlName="status"]')).getAttribute('value')).toBe('not_started');
      });
    });
  });

  describe('Project Management', () => {
    beforeEach(() => {
      // Login first
      element(by.css('input[formControlName="username"]')).sendKeys('admin');
      element(by.css('input[formControlName="password"]')).sendKeys('admin123');
      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();
    });

    it('should navigate to projects page', () => {
      element(by.css('a[routerLink="/projects"]')).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/projects');
    });

    it('should create a new project', () => {
      element(by.css('a[routerLink="/projects"]')).click();
      browser.waitForAngular();

      element(by.css('button:contains("Add Project")')).click();
      browser.waitForAngular();

      element(by.css('input[formControlName="name"]')).sendKeys('E2E Test Project');
      element(by.css('textarea[formControlName="description"]')).sendKeys('E2E Test Project Description');

      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();

      expect(element(by.css('.project-item')).isPresent()).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      // Login first
      element(by.css('input[formControlName="username"]')).sendKeys('admin');
      element(by.css('input[formControlName="password"]')).sendKeys('admin123');
      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();
    });

    it('should navigate between pages', () => {
      // Dashboard
      element(by.css('a[routerLink="/dashboard"]')).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');

      // Tasks
      element(by.css('a[routerLink="/tasks"]')).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/tasks');

      // Projects
      element(by.css('a[routerLink="/projects"]')).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/projects');
    });

    it('should logout and redirect to login', () => {
      element(by.css('.logout-button')).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/login');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      // Login first
      element(by.css('input[formControlName="username"]')).sendKeys('admin');
      element(by.css('input[formControlName="password"]')).sendKeys('admin123');
      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();
    });

    it('should show validation errors for empty task form', () => {
      element(by.css('a[routerLink="/tasks"]')).click();
      browser.waitForAngular();

      element(by.css('button:contains("Add Task")')).click();
      browser.waitForAngular();

      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();

      expect(element(by.css('.field-error')).isPresent()).toBeTruthy();
    });

    it('should show validation errors for empty project form', () => {
      element(by.css('a[routerLink="/projects"]')).click();
      browser.waitForAngular();

      element(by.css('button:contains("Add Project")')).click();
      browser.waitForAngular();

      element(by.css('button[type="submit"]')).click();
      browser.waitForAngular();

      expect(element(by.css('.field-error')).isPresent()).toBeTruthy();
    });
  });
});
