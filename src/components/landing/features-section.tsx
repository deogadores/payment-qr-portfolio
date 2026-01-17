import { Palette, Lock, Zap, LayoutGrid, Clock, Eye } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Fully Customizable',
    description: 'Personalize your QR portfolio with custom colors, logos, and branding to match your identity.',
  },
  {
    icon: Lock,
    title: 'Secure Links',
    description: 'Generate expiring or one-time access links. Control exactly who sees your payment methods.',
  },
  {
    icon: LayoutGrid,
    title: 'Multiple Layouts',
    description: 'Choose from carousel, grid, or single card views to present your QR codes professionally.',
  },
  {
    icon: Clock,
    title: 'Time-Limited Access',
    description: 'Set expiration times on shared links. Links automatically become invalid after the set duration.',
  },
  {
    icon: Eye,
    title: 'Access Tracking',
    description: 'Know when your links are accessed. Track views and manage active sharing links easily.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on modern technology for instant load times and smooth user experience on any device.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to manage and share your payment QR codes with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
