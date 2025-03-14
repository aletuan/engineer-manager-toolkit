# Engineer Manager Toolkit

A modern web application built to help engineering managers streamline their daily tasks, track team performance, and manage resources effectively.

## 🚀 Features

- Team Management Dashboard
  - Loading Team List from a JSON file, each member should:
    - Full Name
    - Phone Contact
    - Email
  - Adding new Team member 
  - Remove a current Team member
- Task (Schedule, and Effort) Tracking
  - SIT Support
  - Incident Support
  - Problem Management
  - Change Request and Management
  - Roster Planning (Primary / Secondary)
- Managing Follow Up Item in a Task
  - Sub Task List
  - Dependency Items
  - Block Items
  - Note
- Team Calendar & Rotation Management
  - Daily schedule display
  - Weekly / Monthly schedule
  - Rotation Swap ( Week Swap, Day Swap)

## 🛠 Tech Stack

- **Framework:** [Next.js 15.1.0](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** 
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Shadcn UI](https://ui.shadcn.com/)
- **Components:** 
  - [Radix UI](https://www.radix-ui.com/) for accessible components
  - [Framer Motion](https://www.framer.com/motion/) for animations
- **State Management:** React Server Components + Server Actions
- **Package Manager:** [pnpm](https://pnpm.io/)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/aletuan/engineer-manager-toolkit.git
cd engineer-manager-toolkit
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
src/
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
│   ├── ui/            # Shadcn UI components
│   └── features/      # Feature-specific components
├── lib/               # Utility functions and shared logic
├── hooks/             # Custom React hooks
├── styles/            # Global styles and Tailwind config
└── public/            # Static assets
```

## 🔧 Development

- **Development server:** `pnpm dev`
- **Type checking:** `pnpm type-check`
- **Linting:** `pnpm lint`
- **Building:** `pnpm build`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) team for the amazing framework
- All contributors who help improve this toolkit

---

Built with ❤️ for Engineering Managers 