// src/App.jsx
// Provides (global): App
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function App() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot" | "app"
  const [storedCredId, setStoredCredId] = useState(null);
  const [passkeyEnabled, setPasskeyEnabled] = useState(true); // system level
  const [passkeySignInEnabled, setPasskeySignInEnabled] = useState(true); // user level
  // Access gating per the onboarding flowchart: company KYC must be
  // complete before anything else, then PAMS must approve both the
  // builder company and the user before full access unlocks.
  // "incomplete" -> "pending" -> "approved"
  const [verificationStage, setVerificationStage] = useState("incomplete");

  if (mode === "app") {
    return (
      <AppShell
        onLogout={() => setMode("login")}
        storedCredId={storedCredId}
        setStoredCredId={setStoredCredId}
        passkeyEnabled={passkeyEnabled}
        setPasskeyEnabled={setPasskeyEnabled}
        passkeySignInEnabled={passkeySignInEnabled}
        setPasskeySignInEnabled={setPasskeySignInEnabled}
        verificationStage={verificationStage}
        setVerificationStage={setVerificationStage}
      />
    );
  }
  if (mode === "register") {
    return (
      <RegistrationScreen
        onDone={() => setMode("login")}
        onCancel={() => setMode("login")}
        onForgotPassword={() => setMode("forgot")}
        storedCredId={storedCredId}
        setStoredCredId={setStoredCredId}
        passkeyEnabled={passkeyEnabled}
      />
    );
  }
  if (mode === "forgot") {
    return (
      <ForgotPasswordScreen
        onDone={() => setMode("login")}
        onCancel={() => setMode("login")}
      />
    );
  }
  return (
    <LoginScreen
      onLoginSuccess={() => setMode("app")}
      onGoRegister={() => setMode("register")}
      onForgotPassword={() => setMode("forgot")}
      storedCredId={storedCredId}
      setStoredCredId={setStoredCredId}
      passkeyEnabled={passkeyEnabled}
      setPasskeyEnabled={setPasskeyEnabled}
      passkeySignInEnabled={passkeySignInEnabled}
    />
  );
}
