# Contributing to ECPay Payment Node.js SDK

Thank you for your interest in contributing to the ECPay Payment Node.js SDK! We welcome contributions from everyone.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/ecpay-payment-node.git
    cd ecpay-payment-node
    ```
3.  **Install dependencies** using Bun:
    ```bash
    bun install
    ```

## Development

-   **Runtime**: This project is built with [Bun](https://bun.sh/). Please ensure you have the required version installed (see `package.json` engines).
-   **Code Style**: We use Prettier associated with ESLint. Run `bun run format` to format your code.
-   **TypeScript**: This project is written in TypeScript. Run `bun run typecheck` to verify types.

## Testing

We use Bun's built-in test runner.

-   Run all tests:
    ```bash
    bun test
    ```
-   Run specific tests:
    ```bash
    bun test test/operations/CreditPayment.test.ts
    ```

Please ensure that all tests pass before submitting a pull request. If you are adding a new feature, please add appropriate unit tests.

## Submitting Changes

1.  Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  Commit your changes with clear, descriptive messages.
3.  Push your branch to your fork:
    ```bash
    git push origin feature/my-new-feature
    ```
4.  Open a **Pull Request** on GitHub against the `main` branch.

## Issue Reporting

If you find a bug or have a feature request, please verify that the issue hasn't already been reported. If not, open a new issue with a clear description and reproduction steps.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
