import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-40">
      
      <HeroSection />

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center"
              >
                <div className="text-4xl font-bold text-blue-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600"> 
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-blue-900 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <CardHeader>
                  {feature.icon && (
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mb-4">
                      {feature.icon}
                    </div>
                  )}
                  <CardTitle className="text-white text-2xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-white text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (

              <div key={index} className="flex flex-col items-center text-center">
                
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-800">
                  {step.icon}
                </div>
                
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card 
                key={index} 
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                    src = {testimonial.image}
                    alt = {`Photo of ${testimonial.name}`}
                    width={64}
                    height={64}
                    className="rounded-full mb-4"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Ready to Take Control?
            </h2>
            
            <p className="mt-4 text-lg text-violet-100 md:text-xl">
              Join Money Mentor today and start your journey towards financial clarity and freedom. 
              It's free to get started.
            </p>
            
            <div className="mt-8">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 font-bold hover:bg-gray-200 px-10 py-6 text-lg transition-transform duration-200 hover:scale-105"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}