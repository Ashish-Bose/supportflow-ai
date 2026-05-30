export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR */}

<nav className="border-b border-zinc-800">

  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

    <div className="flex flex-col">
  <h1 className="text-2xl font-bold leading-none">
    SupportFlow AI
  </h1>

  <span className="text-xs text-gray-400 mt-1">
   Built by Ashish Bose
  </span>
</div>
    

    <div className="hidden md:flex items-center gap-8">

      <a
        href="#features"
        className="text-gray-300 hover:text-white"
      >
        Features
      </a>

      <a
  href="/submit-ticket"
  className="text-gray-300 hover:text-white"
>
  Demo
</a>

      <a
        href="/login"
        className="text-gray-300 hover:text-white"
      >
        Login
      </a>

      <a
  href="/submit-ticket"
  className="bg-white text-black px-4 py-2 rounded-xl font-medium"
>
  Get Started
</a>

    </div>

  </div>

</nav>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center">

          <h1 className="text-6xl font-extrabold mb-6">
            SupportFlow AI
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-powered customer support platform
            that automatically analyzes tickets,
            detects sentiment, assigns priority,
            generates responses, and helps teams
            resolve issues faster.
          </p>

          <div className="flex justify-center gap-4 mt-10">

  <a
    href="/login"
    className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
  >
    Admin Login
  </a>

  <a
    href="/submit-ticket"
    className="border border-white px-6 py-3 rounded-xl font-semibold"
  >
    Submit Ticket
  </a>

</div>

        </div>

      </section>

      {/* FEATURES */}

<section
  id="features"
  className="max-w-7xl mx-auto px-6 py-16"
>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-zinc-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3">
              AI Ticket Analysis
            </h3>

            <p className="text-gray-400">
              Automatically summarize issues,
              detect sentiment, and generate
              suggested replies.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Smart Prioritization
            </h3>

            <p className="text-gray-400">
              AI assigns LOW, MEDIUM, and HIGH
              priority levels automatically.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Audit History
            </h3>

            <p className="text-gray-400">
              Track every status change with a
              complete ticket history timeline.
            </p>
          </div>

        </div>

      </section>

{/* STATS */}

<section className="max-w-7xl mx-auto px-6 py-16">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    <div className="bg-zinc-900 rounded-2xl p-8 text-center">
      <h2 className="text-5xl font-bold">
        10K+
      </h2>

      <p className="text-gray-400 mt-3">
        Tickets Processed
      </p>
    </div>

    <div className="bg-zinc-900 rounded-2xl p-8 text-center">
      <h2 className="text-5xl font-bold">
        95%
      </h2>

      <p className="text-gray-400 mt-3">
        AI Accuracy
      </p>
    </div>

    <div className="bg-zinc-900 rounded-2xl p-8 text-center">
      <h2 className="text-5xl font-bold">
        60%
      </h2>

      <p className="text-gray-400 mt-3">
        Faster Resolution
      </p>
    </div>

  </div>

</section>
{/* DEMO ACCESS */}

<section className="max-w-4xl mx-auto px-6 py-16">

  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

    <h2 className="text-3xl font-bold mb-4">
      Try the Live Demo
    </h2>

    <p className="text-gray-400 mb-8">
      Explore the admin dashboard using the demo credentials below.
    </p>

    <div className="space-y-4 mb-8">

      <div>
        <p className="text-sm text-gray-500">
          Demo Email
        </p>

        <p className="text-lg font-semibold">
          demo@supportflow.ai
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Demo Password
        </p>

        <p className="text-lg font-semibold">
          SupportFlowDemo123
        </p>
      </div>

    </div>

    <a
      href="/login"
      className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold"
    >
      Open Admin Dashboard
    </a>

  </div>

</section>
      {/* TICKET FORM */}

      

    </main>
  );
}