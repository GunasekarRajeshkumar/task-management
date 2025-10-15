import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SeedDataService } from './seed-data.service';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly STORAGE_KEY = 'task_management_user';

  constructor(private seedDataService: SeedDataService) {
    this.loadUserFromStorage();
    this.createDemoUser();
  }

  register(userData: { username: string; email: string; name: string; password: string }): boolean {
    try {
      // Check if user already exists
      const existingUsers = this.getStoredUsers();
      const userExists = existingUsers.some(user => 
        user.email === userData.email || user.username === userData.username
      );

      if (userExists) {
        return false;
      }

      // Create new user
      const newUser: User = {
          id: this.generateId(),
          username: userData.username,
          email: userData.email,
        name: userData.name,
        avatar: this.generateAvatar(userData.name),
        createdAt: new Date()
      };

      // Store user data
      this.storeUser(newUser);
      this.currentUserSubject.next(newUser);
      
      // Seed default tasks for new user
      this.seedDataService.seedDefaultTasks(newUser.id);
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  login(email: string, password: string): boolean {
    try {
      const users = this.getStoredUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }

  private storeUser(user: User): void {
    const users = this.getStoredUsers();
    users.push(user);
    localStorage.setItem('task_management_users', JSON.stringify(users));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private getStoredUsers(): User[] {
    try {
      const stored = localStorage.getItem('task_management_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored users:', error);
      return [];
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateAvatar(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://ui-avatars.com/api/?name=${initials}&background=${color.slice(1)}&color=fff&size=40`;
  }

  private createDemoUser(): void {
    const existingUsers = this.getStoredUsers();
    const demoUserExists = existingUsers.some(user => user.email === 'demo@taskflow.com');
    
    if (!demoUserExists) {
      const demoUser: User = {
        id: 'demo-user-123',
        username: 'demo',
        email: 'demo@taskflow.com',
        name: 'Demo User',
        avatar: this.generateAvatar('Demo User'),
        createdAt: new Date()
      };
      
      // Add demo user to stored users
      const users = this.getStoredUsers();
      users.push(demoUser);
      localStorage.setItem('task_management_users', JSON.stringify(users));
      
      // Seed demo tasks
      this.seedDataService.seedDefaultTasks(demoUser.id);
    }
  }
}