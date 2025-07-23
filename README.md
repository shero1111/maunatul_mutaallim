# Maunatul Mutaallim - Islamic Learning Management System

A comprehensive Islamic education platform for memorization and study of traditional Islamic texts.

## 🏗️ Architecture

### Main Application Repository
- **React TypeScript App** - User interface and business logic
- **Netlify Deployment** - Automatic deployment from master branch
- **User Management** - Role-based access control
- **Progress Tracking** - Individual user progress for Mutuun texts

### Separate Resources Repository
- **Audio Files**: `github.com/shero1111/maunatul_mutaallim_resources`
- **MP3 Streaming**: Direct GitHub raw URLs for audio playback
- **Scalable Storage**: Unlimited audio files without affecting app bundle size
- **Independent Management**: Add/update audio files without app deployment

## 🎵 Audio Integration

Audio files are streamed directly from GitHub raw URLs:
```
https://raw.githubusercontent.com/shero1111/maunatul_mutaallim_resources/main/[filename].mp3
```

Benefits:
- ✅ No download required - instant streaming
- ✅ CORS-friendly for web browsers  
- ✅ Fast loading via GitHub CDN
- ✅ Zero impact on app bundle size
- ✅ Easy to add new audio files

## 🚀 Features

- **Multi-level Islamic Texts** (Mutuun system)
- **User-specific Progress Tracking**
- **Audio Streaming Integration** 
- **Role-based Access Control**
- **Bilingual Support** (Arabic/English)
- **Responsive Design**
- **Real-time User Management**

## 👥 User Roles

1. **Superuser** (admin1) - Full administrative access
2. **Leitung** (leitung1) - Management and oversight  
3. **Lehrer** (lehrer1) - Teaching and student management
4. **Student** (student1/student2) - Learning and progress tracking

## 🔧 Development

```bash
npm install
npm start          # Development server
npm run build      # Production build
```

## 📱 Deployment

- **Automatic**: Push to master triggers Netlify deployment
- **Manual**: Use Netlify dashboard for manual deployments
- **Environment**: Production builds optimized for performance

## 🎯 Audio Management

To add new audio files:
1. Upload MP3 to `maunatul_mutaallim_resources` repository
2. Copy the raw GitHub URL
3. Update audio links in app configuration
4. Deploy changes

This architecture ensures clean separation between code and media assets.
