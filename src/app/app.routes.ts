import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { BookPage } from './pages/book-page/book-page';
import { CategoryPage } from './pages/category-page/category-page';
import { CartPage } from './pages/cart-page/cart-page';
import { OrderPage } from './pages/order-page/order-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { authGuard, roleGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomePage},
    {path: 'books', component: BookPage},
    {path: 'categories', component: CategoryPage, canActivate: [roleGuard('owner', 'inventory_manager')]},
    {path: 'cart', component: CartPage, canActivate: [roleGuard('customer')]},
    {path: 'orders', component: OrderPage, canActivate: [authGuard]},
    {path: 'login', component: LoginPage},
    {path: 'register', component: RegisterPage},
    {path: '**', redirectTo: 'home'},
];
