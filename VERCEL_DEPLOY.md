# Instrucciones para Deployar en Vercel

## ✅ Pre-Deploy Checklist - TODO COMPLETADO

- [x] Build de producción exitoso localmente
- [x] TypeScript sin errores
- [x] Todas las imágenes referenciadas existen
- [x] Meta tags y SEO configurados
- [x] Iconos y manifest PWA configurados
- [x] Servidor de producción probado localmente
- [x] next.config.mjs optimizado para Vercel
- [x] Variables de entorno verificadas

## 🚀 Opción 1: Deploy via Vercel CLI (Recomendado)

### Instalación de Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
# Login a Vercel (primera vez)
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

## 🌐 Opción 2: Deploy via Vercel Dashboard

### Pasos:

1. **Ir a Vercel Dashboard**
   - Visita: https://vercel.com/new
   - Login con tu cuenta de GitHub/GitLab/Bitbucket

2. **Importar Proyecto**
   - Click en "Import Project"
   - Conecta tu repositorio Git
   - Selecciona este proyecto

3. **Configuración del Proyecto**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

4. **Variables de Entorno (Opcional)**
   ```
   NEXT_PUBLIC_SHOW_WEEKLY_BUILDS=true
   ```
   (Solo si quieres mostrar el botón de Weekly Builds)

5. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos

## ⚙️ Configuración Importante para Vercel

### Si el build falla con error de dependencias:

En Vercel Dashboard → Project Settings → General → Build & Development Settings:

**Install Command:**
```bash
npm install --legacy-peer-deps
```

Esto es necesario debido al conflicto de versiones entre `react-day-picker` y `date-fns`.

## 🔍 Verificación Post-Deploy

Una vez deployado, verifica:

1. **Home page carga correctamente**
   - `https://tu-dominio.vercel.app/`

2. **Iconos se muestran**
   - Favicon en la pestaña del navegador
   - Revisa la consola de desarrollador (F12) - no debería haber errores 404

3. **Meta tags**
   - Comparte el link en Twitter/LinkedIn/Slack para ver el preview
   - Usa: https://www.opengraph.xyz/ para verificar Open Graph

4. **Sitemap**
   - `https://tu-dominio.vercel.app/sitemap.xml`

5. **Manifest**
   - `https://tu-dominio.vercel.app/manifest.json`

6. **Lighthouse Audit**
   - Abre Chrome DevTools (F12) → Lighthouse
   - Run audit para Performance, Accessibility, SEO

## 📊 Métricas Esperadas del Build

```
Route (app)                    Size    First Load JS
┌ ○ /                        18.2 kB       119 kB
├ ○ /_not-found                978 B       101 kB
└ ○ /sitemap.xml               135 B       101 kB
```

**Tiempo de build esperado:** 1-3 minutos

## 🔧 Troubleshooting

### Error: "Module not found"
**Solución:** Asegúrate de usar `npm install --legacy-peer-deps` en el Install Command

### Error: "Image optimization failed"
**Solución:** Ya está configurado `images.unoptimized = false` - Vercel lo maneja automáticamente

### Error: TypeScript errors
**Solución:** Todos los errores ya están corregidos. Si aparecen nuevos, revisa `typescript.ignoreBuildErrors` en `next.config.mjs`

### Imágenes no se ven
**Solución:** Todas las imágenes referenciadas ya existen en `/public`:
- `released.png` ✅
- `lero.png` ✅
- `javigil.svg` ✅
- `foto_javigil.jpg` ✅

## 🎯 Dominio Personalizado

Una vez deployado, puedes añadir tu dominio personalizado:

1. Vercel Dashboard → Tu Proyecto → Settings → Domains
2. Añade tu dominio (ej: `bombetacourse.com`)
3. Configura los DNS según las instrucciones de Vercel
4. SSL se configura automáticamente

## 📈 Próximos Pasos Recomendados

Después del deploy:

1. **Analytics:** Añade Vercel Analytics
2. **Speed Insights:** Habilita Vercel Speed Insights
3. **Monitoring:** Configura alertas de uptime
4. **Google Search Console:** Registra tu sitio
5. **Real Icons:** Reemplaza `released.png` y `lero.png` con imágenes reales de productos

---

**¿Listo para deployar?**

```bash
vercel --prod
```

o visita: https://vercel.com/new
