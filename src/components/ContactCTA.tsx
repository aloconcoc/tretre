
import Link from 'next/link';

export default function ContactCTA() {
  return (
    <div className="mt-8 bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
      <h3 className="font-bold text-comay-charcoal uppercase mb-4 text-sm tracking-wide">
        Liên hệ Hotline hoặc Facebook để mua hàng
      </h3>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
        <a 
          href="tel:+84945351093" 
          className="flex items-center gap-2 text-gray-700 hover:text-comay-green transition-colors font-medium bg-white px-4 py-2 rounded shadow-sm w-full sm:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          +84 123 456 789
        </a>
        
        <a 
          href="https://facebook.com/comay.vn" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white bg-[#1877F2] hover:bg-[#166fe5] transition-colors font-medium px-4 py-2 rounded shadow-sm w-full sm:w-auto justify-center"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.848-5.978 5.814-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.376h5.36l-.694 3.667h-4.666v7.98h-4.8z" />
          </svg>
          Gửi tin nhắn
        </a>
      </div>
    </div>
  );
}
