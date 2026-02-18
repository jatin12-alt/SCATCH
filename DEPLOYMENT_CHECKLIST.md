# 🚀 Pre-Deployment Checklist

## ✅ Before Deploying - Complete These Steps

### 1. **Environment Variables** ⚠️ CRITICAL
- [ ] Set `VITE_SUPABASE_URL` in your hosting platform's environment variables
- [ ] Set `VITE_SUPABASE_ANON_KEY` in your hosting platform's environment variables
- [ ] **DO NOT** commit `.env` file to git (it should be in `.gitignore`)

### 2. **Update Placeholder Content**
- [ ] **Contact Page** (`src/pages/Contact.tsx`):
  - Update email: `support@scatch.com` → Your real email
  - Update phone: `+1 (555) 123-4567` → Your real phone
  - Update address: `123 Sustainable Street...` → Your real address
  - Update FAQ content if needed

- [ ] **About Page**: Review and update company info if needed

- [ ] **Sell Page**: Update any placeholder text

### 3. **Meta Tags & SEO** (`index.html`)
- [ ] Update title: Currently "SCATCH Vegan E-commerce App"
- [ ] Update Open Graph image (line 8): Replace `https://bolt.new/static/og_default.png` with your logo/image
- [ ] Update Twitter card image (line 10): Same as above
- [ ] Add meta description for SEO
- [ ] Update favicon: Replace `/vite.svg` with your logo

### 4. **Build & Test**
- [ ] Run `npm run build` locally to ensure no build errors
- [ ] Test `npm run preview` to check production build
- [ ] Test all major flows:
  - [ ] User registration/login
  - [ ] Product browsing
  - [ ] Add to cart
  - [ ] Checkout process
  - [ ] Owner dashboard (if applicable)

### 5. **Supabase Configuration**
- [ ] Verify RLS (Row Level Security) policies are correct
- [ ] Check that all tables have proper indexes
- [ ] Test that owner role works correctly
- [ ] Verify email confirmation settings (if using email auth)

### 6. **Security**
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Never commit Supabase keys to git
- [ ] Review RLS policies for security

### 7. **Performance**
- [ ] Optimize images (if using custom images)
- [ ] Check bundle size (should be reasonable)
- [ ] Test on slow network (throttle in DevTools)

### 8. **Hosting Platform Setup**
Choose your platform and follow their docs:

**Vercel:**
```bash
npm install -g vercel
vercel
# Add environment variables in Vercel dashboard
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
# Add environment variables in Netlify dashboard
```

**Other platforms:** Follow their specific instructions

### 9. **Post-Deployment**
- [ ] Test live site on mobile devices
- [ ] Test all forms work correctly
- [ ] Verify Supabase connection works
- [ ] Check console for errors
- [ ] Test payment/checkout flow (if applicable)

---

## 📝 Quick Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for TypeScript errors
npm run typecheck

# Lint code
npm run lint
```

---

## ⚠️ Important Notes

1. **Environment Variables**: Must be set in your hosting platform, NOT in code
2. **Supabase URL**: Make sure it's your production Supabase project URL
3. **CORS**: Supabase should handle CORS automatically, but verify if issues arise
4. **Domain**: Update Supabase project settings if using custom domain

---

## 🐛 Common Issues

- **Build fails**: Check for TypeScript errors with `npm run typecheck`
- **Environment variables not working**: Ensure they start with `VITE_` prefix
- **Supabase connection fails**: Verify URL and keys are correct
- **RLS blocking queries**: Check Supabase policies

---

Good luck with deployment! 🎉

