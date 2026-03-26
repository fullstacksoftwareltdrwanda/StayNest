import Link from 'next/link'

export function HomeFooter() {
  return (
    <footer className="bg-[var(--primary-dark)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors font-medium">About Us</Link></li>
              <li><Link href="/search" className="text-white/70 hover:text-white transition-colors font-medium">Explore Stays</Link></li>
              <li><Link href="/register" className="text-white/70 hover:text-white transition-colors font-medium">Become a Host</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-white/70 font-medium">Help Center</span></li>
              <li><span className="text-white/70 font-medium">Safety Information</span></li>
              <li><span className="text-white/70 font-medium">Cancellation Options</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-white/70 font-medium">Privacy Policy</span></li>
              <li><span className="text-white/70 font-medium">Terms of Service</span></li>
              <li><span className="text-white/70 font-medium">Cookie Policy</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-white/70 font-medium">support@urugostay.com</span></li>
              <li><span className="text-white/70 font-medium">Kigali, Rwanda</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-lg font-black tracking-tighter">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </span>
          <p className="text-xs text-white/40">© 2026 Urugostay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
