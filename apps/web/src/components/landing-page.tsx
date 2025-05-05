// "use client";
import Link from "next/link";
import {
  Code,
  Server,
  Users,
  GitMerge,
  Shield,
  Zap,
  ChevronRight,
  Terminal,
  ArrowRight,
  GraduationCap,
  Building,
  CheckCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
} from "@kraft/ui";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background w-full h-[100vh] overflow-y-scroll">
      {/* Hero Section */}
      <div className="relative overflow- py-20 md:py-32 border-b border-border">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-[calc(100vh-2rem)] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent" />
          {/* <div className="absolute grid grid-cols-6 w-full h-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-r border-t border-border opacity-10"
              />
            ))}
          </div> */}
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge
                variant="outline"
                className="px-4 py-1 bg-primary/10 text-primary border-primary/20"
              >
                Open Source & Self-Hostable
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Host Your Own{" "}
                <span className="text-primary">Coding Platform</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                An enterprise-grade solution for running coding contests, and
                assessments on your infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contest">
                  <Button size="lg" className="text-primary-foreground">
                    Try Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link target="_blank" href="https://github.com/haki-user/kraft">
                  <Button size="lg" variant="outline">
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <Card className="border border-border/40 bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                    <div className="h-3 w-3 rounded-full bg-destructive/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="ml-2">Terminal</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm text-primary/90 font-mono overflow-x-auto">
                    <code>{`# Clone the repository
$ git clone https://github.com/haki-user/kraft.git

# Install dependencies
$ cd kraft
$ pnpm i

# Start the platform
$ pnpm run dev

✓ Ready in 3.8s
✓ Compiled successfully!

Started server on http://localhost:3002
`}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 bg-secondary/20">
            Features
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need For Code Assessment
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete solution that gives you full control over your coding
            challenges and assessment infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Server className="h-8 w-8 text-primary" />}
            title="Self-Hostable"
            description="No vendor lock-in. Run everything on your own infrastructure. Complete control over data and security."
          />
          <FeatureCard
            icon={<Code className="h-8 w-8 text-primary" />}
            title="Multi-Language Support"
            description="Run code in Python, JavaScript, Java, C++, Rust and more with extensible language executors."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary" />}
            title="Secure Execution"
            description="Isolated code execution environments with configurable resource limits to protect your infrastructure."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary" />}
            title="Scalable Architecture"
            description="Built with message queue and serverless functions to scale easily and handle thousands of concurrent submissions."
          />
          <FeatureCard
            icon={<GitMerge className="h-8 w-8 text-primary" />}
            title="Flexible Workflows"
            description="Adapt to various use cases: technical interviews, hiring assessments, classroom exercises, and competitive programming."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Collaborative"
            description="Work together with your team on creating, reviewing, and evaluating coding challenges."
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 border-t border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 bg-secondary/20">
              Use Cases
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Perfect For Every Context
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a company, university, or running a coding
              competition, our platform adapts to your needs.
            </p>
          </div>

          <Tabs defaultValue="companies" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="competitions">Competitions</TabsTrigger>
            </TabsList>
            <TabsContent value="companies" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">
                      Technical Assessment Platform
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Streamline your technical hiring process with customized
                    coding assessments. Create a branded experience that
                    reflects your company culture.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Candidate pre-screening",
                      "Technical interviews",
                      "Skills assessment",
                      // "Team building exercises",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {/* <div className="flex-1">
                  <Card className="border border-border bg-card/80">
                    <CardHeader>
                      <CardTitle>Hiring Assessment</CardTitle>
                      <CardDescription>
                        Frontend Developer Position
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src="/api/placeholder/500/300"
                        alt="Company dashboard screenshot"
                        className="rounded-md border border-border"
                      />
                    </CardContent>
                  </Card>
                </div> */}
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Educational Tool</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Enhance learning with practical coding exercises. Easily
                    create assignments, grade submissions, and provide feedback
                    to students.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Classroom assignments",
                      "Programming tests",
                      "Automated grading",
                      // "Learning analytics",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {/* <div className="flex-1">
                  <Card className="border border-border bg-card/80">
                    <CardHeader>
                      <CardTitle>CS101: Introduction to Algorithms</CardTitle>
                      <CardDescription>Week 3 Assignment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src="/api/placeholder/500/300"
                        alt="Education dashboard screenshot"
                        className="rounded-md border border-border"
                      />
                    </CardContent>
                  </Card>
                </div> */}
              </div>
            </TabsContent>

            <TabsContent value="competitions" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">
                      Competitive Programming
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Host your own coding competitions with real-time
                    leaderboards, custom problem sets, and sophisticated
                    anti-cheating measures.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Hackathons",
                      "Collegiate contests",
                      "Internal company challenges",
                      "Community competitions",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {/* <div className="flex-1">
                  <Card className="border border-border bg-card/80">
                    <CardHeader>
                      <CardTitle>Winter Code Challenge 2025</CardTitle>
                      <CardDescription>
                        5 Problems • 3 Hours • 250 Participants
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src="/api/placeholder/500/300"
                        alt="Competition dashboard screenshot"
                        className="rounded-md border border-border"
                      />
                    </CardContent>
                  </Card>
                </div> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 bg-secondary/20">
            Architecture
          </Badge>
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform is built with scalability and security in mind, using
            modern technologies for reliable code execution.
          </p>
        </div>

        {/* <div className="grid md:grid-cols-2 gap-12 items-center"> */}
        <div className="flex flex-col justify-center gap-12 items-center">
          <div className="space-y-6">
            <div className="relative pl-8 pb-8 border-l border-border">
              <div className="absolute left-0 top-0 -translate-x-1/2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Code</h3>
              <p className="text-muted-foreground">
                Users write code in your platform's interface and submit
                solutions to problems
              </p>
            </div>

            <div className="relative pl-8 pb-8 border-l border-border">
              <div className="absolute left-0 top-0 -translate-x-1/2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Queue Processing</h3>
              <p className="text-muted-foreground">
                Submissions enter a queue for efficient processing and fair
                scheduling
              </p>
            </div>

            <div className="relative pl-8 pb-8 border-l border-border">
              <div className="absolute left-0 top-0 -translate-x-1/2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Execution</h3>
              <p className="text-muted-foreground">
                Code runs in isolated environments (serverless functions or
                containers) with strict resource limits
              </p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-0 -translate-x-1/2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Results & Feedback</h3>
              <p className="text-muted-foreground">
                Execution results are sent back to the platform for immediate
                feedback to users
              </p>
            </div>
          </div>
          {/* 
          <Card className="border border-border bg-card/80">
            <CardContent className="p-0">
              <img
                src="/api/placeholder/600/400"
                alt="Platform architecture diagram"
                className="rounded-md"
              />
            </CardContent>
          </Card> */}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta-sectionc"
        className="py-24 bg-primary/10 border-t border-border"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to host your own coding platform?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Get started in minutes with our simple setup. Full documentation and
            community support available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://github.com/haki-user/kraft.git" target="_blank">
              <Button size="lg" className="text-primary-foreground">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Kraft</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Kraft. Open source
            </div>
            <div className="flex gap-4">
              <Link
                href="https://github.com/haki-user/kraft.git"
                className="text-sm"
                target="_blank"
              >
                GitHub
              </Link>
              <Link href="#" className="text-sm">
                Docs
              </Link>
              <Link href="#" className="text-sm">
                Community
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="border border-border bg-card/60 hover:bg-card/80 transition-colors h-full">
      <CardHeader>
        <div className="mb-4 p-2 w-fit rounded-md bg-primary/10">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
