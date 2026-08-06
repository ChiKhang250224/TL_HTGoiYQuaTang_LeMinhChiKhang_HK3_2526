export default function Home() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-gutter md:px-xl py-xl space-y-32">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-xl lg:gap-32 mt-lg">
        {/* Hero Content */}
        <div className="flex-1 space-y-lg text-center lg:text-left">
          <h1 className="font-display-lg text-display-lg lg:text-[64px] lg:leading-[72px] text-on-surface font-extrabold tracking-tight">
            Tìm món quà hoàn hảo trong <span className="gradient-text">60 giây</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
            Trả lời 6 câu hỏi đơn giản — AI sẽ gợi ý món quà phù hợp nhất với người nhận. Nhanh chóng, tinh tế và đầy ý nghĩa.
          </p>
          <div className="pt-sm flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-md">
            <button className="w-full sm:w-auto bg-primary-container hover:bg-primary text-white font-label-md text-label-md px-8 py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
              Bắt đầu ngay
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
        {/* Hero Illustration */}
        <div className="flex-1 relative w-full max-w-lg mx-auto lg:mx-0 aspect-square">
          <div className="absolute inset-0 bg-gradient-to-tr from-surface-container to-surface-container-lowest rounded-[2rem] shadow-sm transform rotate-3 scale-105 opacity-50"></div>
          <div className="relative w-full h-full rounded-[2rem] bg-white shadow-md overflow-hidden flex items-center justify-center p-md border border-surface-container-high z-10 group">
            <img 
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" 
              alt="A highly stylized, modern 3D illustration" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOkmGNO_J4pSJFvb50vkBmQmuGX2N2fd8pCq7qBzxom7qmdTwvQai--Eu-Y4AUzFhGnaA9HVqTUpc6wwwBcdA8z00P1nZ2tDsQVmFRUg2cAgkV5qW0PyRSzoSjQ0WSB18LBjmGdMp4q7htvLa9PQXh7-NazwhO9JuHMvKEX7r3Lxb7XTUvpeTvU8LJUaZ2IEc1M9X6be7j2ZRyhQeNhpoqnilS6bASxaWI2ANpYlbNd4TNtivdFrTxcw"
            />
            {/* Floating badges */}
            <div className="absolute top-8 left-[-10px] bg-white px-4 py-2 rounded-lg shadow-sm border border-surface-container flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="material-symbols-outlined text-secondary-container">auto_awesome</span>
              <span className="font-label-sm text-label-sm text-on-surface">AI Phân tích</span>
            </div>
            <div className="absolute bottom-16 right-[-20px] bg-white px-4 py-2 rounded-lg shadow-sm border border-surface-container flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <span className="material-symbols-outlined text-primary-container icon-filled">favorite</span>
              <span className="font-label-sm text-label-sm text-on-surface">Độ trùng khớp 99%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-xl">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Tại sao chọn GiftMatch AI?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-md lg:p-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-container group">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center mb-sm group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-[32px] text-secondary">quiz</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface mb-xs">Khảo sát thông minh</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              6 câu hỏi ngắn gọn được thiết kế chuyên sâu để thấu hiểu sở thích, tính cách và dịp tặng quà.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-md lg:p-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-container group transform md:-translate-y-4">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center mb-sm group-hover:bg-primary-fixed transition-colors relative overflow-hidden">
              <span className="material-symbols-outlined text-[32px] text-primary-container z-10 relative">auto_awesome</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-fixed to-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface mb-xs">Gợi ý cá nhân hóa</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Thuật toán AI phân tích hàng ngàn sản phẩm để tìm ra những lựa chọn độc đáo, cá nhân hóa đến từng chi tiết.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-md lg:p-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-container group">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center mb-sm group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-[32px] text-secondary">storefront</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface mb-xs">Từ cửa hàng uy tín</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Liên kết trực tiếp với các thương hiệu chất lượng cao, đảm bảo món quà hoàn hảo từ hình thức đến chất lượng.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
