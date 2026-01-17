import { Upload, Settings, Share2, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your QR Codes',
    description: 'Add your payment QR codes from GCash, Maya, bank apps, and more. Organize them with names and account details.',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Customize Your Page',
    description: 'Choose your preferred layout, set your colors, add your logo, and make it match your brand or personal style.',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Generate Secure Links',
    description: 'Create time-limited or one-time access links. Share them via messaging apps, email, or anywhere you need.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Get Paid Easily',
    description: 'Recipients scan your QR codes directly from the shared page. Clean, professional, and hassle-free payments.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Simple as 1-2-3-4
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and share your payment QR codes professionally
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="relative flex gap-6 p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
                >
                  {/* Step number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
