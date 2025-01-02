// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { join } from 'path';

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.SMTP_MAIL,     // Your email
//             pass: process.env.SMTP_PASSWORD, // Your email password or app password
//         },
//       },
//       defaults: {
//         from: '"No Reply" <noreply@example.com>', // Default sender info
//       },
//       template: {
//         dir: join(__dirname, 'templates'), // Path to email templates
//         adapter: new HandlebarsAdapter(), // Optional, use Handlebars for templates
//         options: {
//           strict: true,
//         },
//       },
//     }),
//   ],
//   exports: [MailerModule], // Export for use in other modules
// })
// export class MailModule {}
