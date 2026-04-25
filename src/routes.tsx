import { createBrowserRouter } from "react-router";
import HomeScreen from "./pages/App";
import ErrorScreen from "./pages/error";
import RootLayout from "./components/layout/Rootlayout";
import LoginScreen from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import authrootlayout from "./components/layout/authrootlayout";
import verifyOTPPage from "./pages/auth/verify-otp";
import ConfirmPasswordPage from "./pages/auth/ConfirmPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import resetPassword from "./components/auth/reset-password";
import WishlistPage from "./pages/auth/Wishlist";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import FAQPage from "./pages/FAQ";
import CareersPage from "./pages/Careers";
import CareGuidePage from "./pages/CareGuide";
import TermsOfServicePage from "./pages/TermsOfService";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import PressPage from "./pages/Press";
import SustainabilityPage from "./pages/Sustainability";
import ShippingReturnsPage from "./pages/ShippingReturns";
import TrackOrderPage from "./pages/TrackOrder";
import ShopCategoryPage from "./pages/ShopCategory";
import ShopPage from "./pages/Shop";
import AccountPage from "./pages/Account";
import CheckoutPage from "./pages/Checkout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorScreen,
    children: [
      { index: true, Component: HomeScreen },
      { path: "account", Component: AccountPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "faq", Component: FAQPage },
      { path: "careers", Component: CareersPage },
      { path: "care-guide", Component: CareGuidePage },
      { path: "terms-of-service", Component: TermsOfServicePage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "press", Component: PressPage },
      { path: "sustainability", Component: SustainabilityPage },
      { path: "shipping-returns", Component: ShippingReturnsPage },
      { path: "track-order", Component: TrackOrderPage },
      { path: "shop/:category", Component: ShopCategoryPage },
      { path: "shop", Component: ShopPage }
    ],
  },
  {
    path: "/login",
    Component: authrootlayout,
    children: [{ index: true, Component: LoginScreen }],
  },
  {
    path: "/forgot-password",
    Component: authrootlayout,
    children: [{ index: true, Component: ForgetPassword }],
  },
  {
    path: "/reset-password",
    Component: authrootlayout,
    children: [{ index: true, Component: resetPassword }],
  },
  {
    path: "/signup",
    Component: authrootlayout,
    children: [
      { index: true, Component: SignupPage },
      { path: "verify-otp", Component: verifyOTPPage },
      { path: "confirm-password", Component: ConfirmPasswordPage },
    ],
  },
]);
