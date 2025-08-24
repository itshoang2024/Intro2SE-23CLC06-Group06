const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.initialized = false;
    this.initializationPromise = null;
  }

  async ensureInitialized() {
    logger.info('ensureInitialized() called');
    if (!this.initializationPromise) {
      logger.info('Starting initialization...');
      this.initializationPromise = this.initializeService();
    } else {
      logger.info('Initialization already in progress or complete');
    }
    await this.initializationPromise;
    logger.info(`Initialization complete. Templates available: ${this.templates.size}`);
  }

  async initializeService() {
    logger.info('Starting email service initialization...');
    
    // Initialize SMTP transporter (don't let this block template compilation)
    logger.info('Initializing SMTP transporter...');
    try {
      await this.initializeTransporter();
    } catch (error) {
      logger.error('SMTP initialization failed, continuing with template compilation...');
      logger.error('SMTP Error details:', error.message);
    }

    // Compile email templates
    logger.info('Compiling email templates...');
    try {
      await this.compileTemplates();
    } catch (error) {
      logger.error('Template compilation failed:', error.message);
    }

    // Register Handlebars helpers
    logger.info('Registering Handlebars helpers...');
    try {
      this.registerHelpers();
    } catch (error) {
      logger.error('Helper registration failed:', error.message);
    }

    // Check if we have templates (even if SMTP failed)
    this.initialized = this.templates.size > 0;
    logger.info(`Email service initialization completed. Templates available: ${this.initialized}`);
    
    // Log final status
    if (this.transporter) {
      logger.info('✅ Email service fully operational (SMTP + Templates)');
    } else {
      logger.warn('⚠️  Email service partially operational (Templates only - SMTP failed)');
    }
  }

  async initializeTransporter() {
    try {
      // Check if required environment variables are present
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.FROM_EMAIL) {
        const missing = [];
        if (!process.env.SMTP_USER) missing.push('SMTP_USER');
        if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');
        if (!process.env.FROM_EMAIL) missing.push('FROM_EMAIL');
        throw new Error(`Missing required email environment variables: ${missing.join(', ')}`);
      }

      logger.info(`Initializing SMTP with user: ${process.env.SMTP_USER}`);

      // Create transporter with more robust Gmail configuration
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
        // Additional security options
        tls: {
          rejectUnauthorized: false
        },
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
      });

      // Test the connection
      logger.info('Testing SMTP connection...');
      await this.transporter.verify();
      logger.info('SMTP configuration verified successfully');
    } catch (error) {
      logger.error('SMTP configuration failed:');
      logger.error('Error message:', error.message || 'Unknown error');
      logger.error('Error code:', error.code || 'No code');
      logger.error('Error response:', error.response || 'No response');
      logger.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      this.transporter = null;
      throw error;
    }
  }

  async compileTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/emails');
      logger.info(`Templates directory: ${templatesDir}`);

      // Check if templates directory exists
      try {
        await fs.access(templatesDir);
        logger.info('Templates directory is accessible');
      } catch (error) {
        logger.error('Templates directory not accessible:', error.message);
        throw new Error('Templates directory not found');
      }

      // Register partials
      const partialsDir = path.join(templatesDir, 'partials');
      const partialFiles = await fs.readdir(partialsDir);

      for (const file of partialFiles) {
        if (file.endsWith('.hbs')) {
          const name = path.basename(file, '.hbs');
          const content = await fs.readFile(path.join(partialsDir, file), 'utf8');
          handlebars.registerPartial(name, content);
        }
      }

      // Compile base layout
      const layoutPath = path.join(templatesDir, 'layouts/base.hbs');
      const layoutContent = await fs.readFile(layoutPath, 'utf8');
      this.baseLayout = handlebars.compile(layoutContent);

      // Compile email templates
      const templatesPath = path.join(templatesDir, 'templates');
      logger.info(`Templates path: ${templatesPath}`);
      
      const templateFiles = await fs.readdir(templatesPath);
      logger.info(`Found template files: ${templateFiles.join(', ')}`);

      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const name = path.basename(file, '.hbs');
          const content = await fs.readFile(path.join(templatesPath, file), 'utf8');
          this.templates.set(name, handlebars.compile(content));
          logger.info(`Compiled template: ${name}`);
        }
      }

      logger.info(`Compiled ${this.templates.size} email templates`);
      logger.info(`Available templates: ${Array.from(this.templates.keys()).join(', ')}`);
    } catch (error) {
      logger.error('Failed to compile templates:', error);
      // Fallback to inline templates if file loading fails
      this.setupFallbackTemplates();
    }
  }

  registerHelpers() {
    // Helper to format dates
    handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });

    // Helper for conditional classes
    handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    // Helper to get current year
    handlebars.registerHelper('currentYear', () => {
      return new Date().getFullYear();
    });
  }

  setupFallbackTemplates() {
    // Simple fallback templates if file loading fails
    this.templates.set(
      'verify-email',
      handlebars.compile(`
      <h2>Verify Your Email</h2>
      <p>Please click the link below to verify your email:</p>
      <p><a href="{{verificationUrl}}">{{verificationUrl}}</a></p>
    `)
    );

    this.templates.set(
      'reset-password',
      handlebars.compile(`
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="{{resetUrl}}">{{resetUrl}}</a></p>
    `)
    );
  }

  renderTemplate(templateName, data) {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    // Render the template content
    const body = template(data);

    // If we have a base layout, wrap the content
    if (this.baseLayout) {
      return this.baseLayout({
        ...data,
        body,
        currentYear: new Date().getFullYear(),
      });
    }

    // Fallback to just the body
    return body;
  }

  async sendEmail(options) {
    // Ensure service is initialized
    await this.ensureInitialized();
    
    if (!this.transporter) {
      const errorMsg = 'Email service is not available - SMTP not configured properly. Please check your Gmail credentials and app password.';
      logger.error(errorMsg);
      
      // In development, we might want to continue without failing
      if (process.env.NODE_ENV === 'development') {
        logger.warn('⚠️  Development mode: Email would have been sent to:', options.to);
        logger.warn('Subject:', options.subject);
        return { messageId: 'dev-mode-no-smtp', accepted: [options.to] };
      }
      
      throw new Error(errorMsg);
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"VocaBoost" <${process.env.FROM_EMAIL}>`,
        ...options,
      });

      logger.info(`✅ Email sent: ${info.messageId}`);

      // Log to audit trail
      await this.logEmailSent(options.to, options.subject);

      return info;
    } catch (error) {
      logger.error('❌ Failed to send email:', error.message);
      throw error;
    }
  }

  async sendEmailVerification(to, verificationToken) {
    await this.ensureInitialized();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const html = this.renderTemplate('verify-email', {
      verificationUrl,
      subject: 'Verify Your Email',
    });

    return this.sendEmail({
      to,
      subject: '✨ Welcome to VocaBoost - Verify Your Email',
      html,
      text: `Welcome to VocaBoost! Please verify your email by visiting: ${verificationUrl}`,
    });
  }

  async sendPasswordReset(to, resetToken) {
    await this.ensureInitialized();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = this.renderTemplate('reset-password', {
      resetUrl,
      userEmail: to,
      subject: 'Password Reset Request',
    });

    return this.sendEmail({
      to,
      subject: '🔐 VocaBoost - Password Reset Request',
      html,
      text: `Reset your password by visiting: ${resetUrl}. This link expires in 15 minutes.`,
    });
  }

  async sendWelcomeEmail(to, displayName) {
    await this.ensureInitialized();
    
    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;

    const html = this.renderTemplate('welcome', {
      displayName: displayName || 'Learner',
      dashboardUrl,
      subject: 'Welcome to VocaBoost!',
    });

    return this.sendEmail({
      to,
      subject: "🎉 Welcome to VocaBoost - Let's Get Started!",
      html,
      text: `Welcome to VocaBoost, ${displayName}! Visit your dashboard at: ${dashboardUrl}`,
    });
  }

  // Helper method to send custom emails
  async sendCustomEmail(to, subject, templateName, data) {
    await this.ensureInitialized();
    
    const html = this.renderTemplate(templateName, {
      ...data,
      subject,
    });

    return this.sendEmail({
      to,
      subject,
      html,
      text: data.textFallback || subject,
    });
  }

  // Batch email sending
  async sendBatchEmails(emailList) {
    const results = await Promise.allSettled(
      emailList.map(({ to, subject, template, data }) =>
        this.sendCustomEmail(to, subject, template, data)
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    logger.info(`Batch email results: ${successful} sent, ${failed} failed`);
    return { successful, failed, results };
  }

  // Audit logging
  async logEmailSent(to, subject) {
    // In production, this would write to database
    logger.info(
      `📧 Email sent to: ${to}, Subject: ${subject}, Time: ${new Date().toISOString()}`
    );
  }

  // Preview email in development
  async previewEmail(templateName, data) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Email preview only available in development');
    }

    const html = this.renderTemplate(templateName, data);
    const previewPath = path.join(
      __dirname,
      `../temp/email-preview-${Date.now()}.html`
    );
    await fs.writeFile(previewPath, html);

    logger.info(`📧 Email preview saved to: ${previewPath}`);
    return previewPath;
  }

  async sendClassInvitation(to, token, classInfo, teacherName) {
    await this.ensureInitialized();
    
    const joinUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;

    const html = this.renderTemplate('classroom-invitation', {
      joinUrl,
      className: classInfo.name,
      classDescription: classInfo.description,
      teacherName: teacherName || 'Your teacher',
      subject: `Invitation to join classroom: ${classInfo.name}`,
    });

    return this.sendEmail({
      to,
      subject: `🎓 VocaBoost Invitation - Join "${classInfo.name}"`,
      html,
      text: `You've been invited to join the class "${classInfo.name}". Use this link: ${joinUrl}`,
    });
  }
}

module.exports = new EmailService();
