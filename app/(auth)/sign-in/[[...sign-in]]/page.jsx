"use client"
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gradient-to-br from-green-100 to-blue-100 lg:col-span-5 lg:h-full xl:col-span-6">
          {/* Dynamic Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-blue-200/50 animate-gradient-x"></div>

          {/* Parallax-Style Background Image */}
          <img
            alt="Financial Journey Landscape"
            src="https://i0.wp.com/picjumbo.com/wp-content/uploads/calming-gradient-waves-wallpaper-free-photo.jpg?w=2210&quality=70"
            className="absolute inset-0 h-full w-full object-cover opacity-50 blur-[2px] hover:blur-none transition-all duration-500 ease-in-out"
          />

          {/* Typography Section with Advanced Animations */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-8">
            <div className="text-center space-y-6">
              {/* Innovative Title with Animated Underline */}
              <h1 className="relative text-6xl font-bold text-white mb-4 group">
                Take Control of your Financial Destiny
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                 
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left delay-200"></span>
                 
              </h1>

            

          {/* Sophisticated Subtext with Advanced Hover Effects */}
          <p className="text-xl text-white opacity-80 
            transition-all duration-500 ease-in-out 
             hover:opacity-100 hover:tracking-wide 
            transform hover:scale-105 
            inline-block group">
          <span className="block transition-all duration-500 
               group-hover:text-blue-200 
                group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                Craft Your Financial Narrative
              </span>
          <span className="block text-sm mt-2 opacity-60 
               transition-all duration-500 
           group-hover:opacity-100 
           group-hover:text-green-200 
           group-hover:translate-y-1    group-hover:translate-x-2">
                 Expenses Tracked • Savings Amplified • Dreams Realized
                </span>
            </p>

  {/* Enhanced Animated Highlight Boxes */}
            <div className="flex justify-center space-x-4 mt-6">
              {['Vision', 'Strategy', 'Freedom'].map((word, index) => (
              <div 
                key={word}
             className="px-5 py-3 
                   border-2 border-white/30 text-white 
                 rounded-lg 
                   hover:bg-white/10 
               transition-all duration-500 ease-in-out 
               transform hover:-translate-y-3 hover:scale-110 
                 hover:border-blue-300 
               opacity-80 hover:opacity-100 
                 shadow-sm hover:shadow-xl"
              style={{
                 transitionDelay: `${index * 100}ms`,
                 transformOrigin: 'center bottom'
              }}
         >
               {word}
           </div>
           ))}
          </div>
            </div>
          </div>

          {/* Subtle Particle-Like Background Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white/10 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 20 + 5}px`, 
                  height: `${Math.random() * 20 + 5}px`,
                  animationDuration: `${Math.random() * 10 + 5}s`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </section>

        {/* Right Side (SignIn Form) */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                
                <span className="sr-only">Home</span>
                <svg
                  className="h-8 sm:h-10"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>

            <SignIn afterSignInUrl="/dashboard" redirectUrl="/dashboard" />
          </div>
        </main>
      </div>
    </section>
  );
}