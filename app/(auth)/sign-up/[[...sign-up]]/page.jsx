import { SignUp } from "@clerk/nextjs";
import Image from 'next/image';

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Calm ocean landscape background */}
      <Image 
        src="https://static.vecteezy.com/system/resources/thumbnails/050/286/917/small_2x/a-calm-ocean-with-a-pink-and-blue-sky-in-the-background-photo.jpg" 
        alt="Serene ocean landscape" 
        layout="fill" 
        objectFit="cover" 
        className="absolute inset-0 z-0 opacity-60"
      />
      
      {/* Signup container with frosted glass effect */}
      <div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-lg rounded-xl shadow-2xl p-8">
        <SignUp 
          appearance={{
            elements: {
              card: "bg-transparent shadow-none",
              headerTitle: "text-2xl font-bold text-gray-800",
              headerSubtitle: "text-gray-600",
              formFieldLabel: "text-gray-700",
              formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white"
            }
          }} 
        />
      </div>
    </div>
  );
}