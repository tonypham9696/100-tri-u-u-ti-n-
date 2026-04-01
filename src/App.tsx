import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { Check, X, Copy, MessageCircle, Download, Star } from 'lucide-react';

const EBOOK_LINK = 'https://c-ch-100-tri-u-u-ti-n-trong-cu-c-i.vercel.app/ebook.pdf';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');
  const [isCopyingAcc, setIsCopyingAcc] = useState(false);
  const [isCopyingMsg, setIsCopyingMsg] = useState(false);
  const [toast, setToast] = useState('');

  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tickerRef.current) {
      const content = tickerRef.current.innerHTML;
      tickerRef.current.innerHTML = content + content;
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setStep(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const field = id.replace('inp-', '');
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Vui lòng nhập email hợp lệ';
    if (!/^(0|\+84)[0-9]{8,10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handleConfirmPayment = async () => {
    const oid = `ORD100-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    setOrderId(oid);
    setStep(3);

    try {
      // Save to Firebase
      await addDoc(collection(db, 'orders_100trieu'), {
        id: oid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        product: '100 Triệu Đầu Tiên',
        amount: 79000,
        status: 'paid',
        createdAt: new Date().toISOString()
      });

      // Send Email via EmailJS
      emailjs.init('pvX97fMNrYufb95rT');
      await emailjs.send('service_4f0jzbe', 'template_31ibhd6', {
        to_email: formData.email,
        to_name: formData.name,
        order_id: oid,
        download_link: EBOOK_LINK
      });
      showToast(`📧 Email đã gửi đến ${formData.email}`);
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  const copyToClipboard = (text: string, type: 'acc' | 'msg') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'acc') {
        setIsCopyingAcc(true);
        setTimeout(() => setIsCopyingAcc(false), 2000);
      } else {
        setIsCopyingMsg(true);
        setTimeout(() => setIsCopyingMsg(false), 2000);
      }
    });
  };

  const toggleFaq = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

  return (
    <div className="min-h-screen">
      {/* TOPBAR */}
      <nav className="topbar">
        <div className="tb-brand">100 <span>Triệu</span> Đầu Tiên</div>
        <div className="flex items-center gap-3">
          <span className="tb-price">199.000đ</span>
          <button className="tb-btn" onClick={openModal}>Mua ngay — 79.000đ ↓</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-dots"></div>
        <div className="hero-line"></div>
        <div className="container">
          <div className="hero-inner">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="hero-eye">Ebook Tài Chính Cá Nhân — 10 Chương Đầy Đủ</div>
              <h1 className="hero-h1">
                90% người đi làm sẽ <em>KHÔNG BAO GIỜ</em> có 100 triệu đầu tiên.<br />
                Không phải vì họ lười.<br />
                Mà vì họ không hiểu cách tiền hoạt động.
              </h1>
              <p className="hero-sub">Nếu bạn đi làm mỗi ngày nhưng cuối tháng vẫn gần như bằng 0 — bạn không thiếu tiền, bạn thiếu hệ thống.</p>
              <p className="hero-pain">Bạn đi làm mỗi ngày. Nhưng 6 tháng, 1 năm trôi qua… tài khoản vẫn gần như không đổi.</p>
              <ul className="hero-list">
                <li>Biết tiền đang mất ở đâu mỗi tháng</li>
                <li>Thoát khỏi vòng lặp kiếm → tiêu hết</li>
                <li>Thiết lập hệ thống giữ tiền tự động</li>
                <li>Tăng tiết kiệm lên 20%+</li>
                <li>Có lộ trình đạt 100 triệu đầu tiên</li>
              </ul>
              <div className="price-row">
                <span className="p-old">199.000đ</span>
                <span className="p-real">79.000đ</span>
                <span className="p-badge">−60%</span>
              </div>
              <div className="mb-3.5 text-[13px] text-[#ff9a9a] font-semibold">
                ⏰ Ưu đãi có giới hạn — giá gốc 199k đang được giảm còn 79k. Đừng để lỡ.
              </div>
              <button className="cta-main" onClick={openModal}>NHẬN NGAY EBOOK — 79.000Đ</button>
              <div className="mt-3.5 border border-[rgba(201,168,76,0.25)] rounded-lg p-3 text-[13px] text-[rgba(255,255,255,0.6)] leading-relaxed">
                ✅ <strong className="text-[rgba(255,255,255,0.85)]">Tại sao nên bắt đầu ngay hôm nay?</strong><br />
                📌 Mỗi tháng trì hoãn = một tháng tiền tiếp tục biến mất.<br />
                📌 79k nhỏ hơn một bữa cơm trưa — nhưng có thể thay đổi cả năm tài chính của bạn.<br />
                📌 Thiết lập hệ thống 1 lần — hưởng lợi cả đời.
              </div>
              <p className="hero-compare">Một lần đi nhậu 200–300k. Ebook này chỉ 79k nhưng có thể giúp bạn giữ lại hàng chục triệu mỗi năm.</p>
              <p className="hero-note">✓ Giao qua email trong 15–30 phút &nbsp;·&nbsp; ✓ Đọc trên mọi thiết bị</p>
              <div className="mt-3.5 bg-[rgba(227,53,53,0.1)] border border-[rgba(227,53,53,0.3)] rounded-lg p-2.5 text-[13px] text-[#ffaaaa] font-semibold text-center">
                ⚡ Giá ưu đãi 79k chỉ còn trong thời gian có hạn — có thể tăng lên 149k bất kỳ lúc nào
              </div>
              <div className="mt-3 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.2)] rounded-lg p-3 text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed">
                🎁 <strong className="text-[var(--gold)]">Mua hôm nay còn nhận thêm:</strong> Worksheet Bản Đồ Tài Chính + Checklist 12 Tháng + Công Cụ Tính Toán — tất cả trong 1 file, không cần phần mềm đặc biệt.
              </div>
              <div className="hero-tags">
                <span className="hero-tag">📘 10 Chương</span>
                <span className="hero-tag">📊 Worksheet thực hành</span>
                <span className="hero-tag">✅ Checklist từng bước</span>
                <span className="hero-tag">🔢 Công cụ tính toán</span>
              </div>
            </motion.div>
            <div className="book-scene">
              <motion.div
                className="book-wrap"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="book" onClick={openModal}>
                  <div className="book-in">
                    <div>
                      <div className="b-cat">Tài chính cá nhân</div>
                      <div className="b-num">100</div>
                      <div className="b-ttl">Triệu Đầu Tiên</div>
                    </div>
                    <div>
                      <div className="b-tag">Ẩn mình như hổ — tích lũy như rồng</div>
                      <div className="b-div"></div>
                      <div className="b-tag">Lộ trình thực tế cho người<br />thu nhập 8–20 triệu</div>
                      <div className="b-div"></div>
                      <div className="b-inc">worksheet • checklist • công cụ tính toán</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner" ref={tickerRef}>
          <span><Star className="inline w-3 h-3 text-gold fill-gold" />★★★★★ <b>"Tiết kiệm được 5 triệu/tháng sau 6 tuần áp dụng hệ thống 3 TK"</b> — Nguyễn Minh T.</span>
          <span><Star className="inline w-3 h-3 text-gold fill-gold" />★★★★★ <b>"Chương 3 thay đổi hoàn toàn cách mình nhìn tiền"</b> — Trần Lan H.</span>
          <span><Star className="inline w-3 h-3 text-gold fill-gold" />★★★★★ <b>"Lộ trình 12 tháng rõ ràng từng bước, không mơ hồ"</b> — Lê Minh K.</span>
          <span><Star className="inline w-3 h-3 text-gold fill-gold" />★★★★★ <b>"Hiểu ra tại sao mình không bao giờ giàu được — và đã sửa"</b> — Nguyễn Thu P.</span>
          <span><Star className="inline w-3 h-3 text-gold fill-gold" />★★★★★ <b>"Thiết lập xong hệ thống trong 1 buổi, tháng nào cũng tiết kiệm"</b> — Phạm Duy A.</span>
        </div>
      </div>

      {/* PAIN POINTS */}
      <section className="bg-[#0D0D14] py-13 border-b border-[rgba(201,168,76,0.12)]">
        <div className="container">
          <div className="max-w-[540px] mx-auto text-center">
            <div className="s-label block mb-4.5">Bạn có đang như này không?</div>
            <ul className="pain-list">
              <li><span className="pain-x">✗</span> Lương 10–20tr nhưng cuối tháng không còn dư</li>
              <li><span className="pain-x">✗</span> Không biết tiền đi đâu mỗi tháng</li>
              <li><span className="pain-x">✗</span> Muốn tiết kiệm nhưng không giữ được</li>
            </ul>
            <div className="pain-box">→ Bạn không thiếu tiền, bạn thiếu hệ thống.</div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section s-alt">
        <div className="container">
          <div className="story-grid">
            <motion.div
              className="story-text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="s-label">Câu chuyện thật</div>
              <h2 className="s-title">Không phải vì bạn lười. Mà vì chưa ai dạy bạn cách đúng.</h2>
              <p>Thu nhập 12 triệu. Cuối tháng còn 200 ngàn. Bạn không biết tiền chạy đi đâu hết — không phải vì bạn tiêu hoang, mà vì <strong>không ai dạy bạn cách giữ tiền và nhân tiền đúng cách.</strong></p>
              <div className="story-quote">"Trước lương 12tr nhưng hết sạch, giờ giữ được 4–5tr/tháng" <br /><strong>— Minh, 27 tuổi</strong></div>
              <p>Vấn đề không nằm ở con số thu nhập. Vấn đề nằm ở <strong>hệ thống</strong> — hay đúng hơn là sự thiếu vắng của nó. Cuốn ebook này ra đời để lấp đầy khoảng trống đó.</p>
              <div className="stat-bar">
                <div className="stat-item"><div className="stat-num">10</div><div className="stat-lbl">Chương đầy đủ</div></div>
                <div className="stat-item"><div className="stat-num">3+</div><div className="stat-lbl">Worksheet & Checklist</div></div>
                <div className="stat-item"><div className="stat-num">79K</div><div className="stat-lbl">Giá chỉ</div></div>
              </div>
            </motion.div>
            <div className="story-cards">
              <StoryCard
                name="Trần Lan Hương"
                role="Giáo viên, 31 tuổi"
                quote="Hệ thống 3 tài khoản thay đổi hoàn toàn cách mình quản lý tiền. Chỉ mất 1 buổi thiết lập, từ đó tháng nào cũng tiết kiệm."
                result="✓ Tiết kiệm 4,5 triệu/tháng ổn định"
                img="https://picsum.photos/seed/woman1/100/100"
              />
              <StoryCard
                name="Lê Minh Khoa"
                role="Kỹ sư, 29 tuổi"
                quote="Đang trả góp xe và không biết bắt đầu từ đâu. Lộ trình 12 tháng cho tôi thấy chính xác cần làm gì từng tháng."
                result="✓ Trả hết 1 khoản nợ sau 4 tháng"
                img="https://picsum.photos/seed/man1/100/100"
              />
              <StoryCard
                name="Nguyễn Thu Phương"
                role="Nhân viên văn phòng, 26 tuổi"
                quote="Chương 3 về chi phí cơ hội mở mắt tôi. Hiểu ra tại sao mình không bao giờ giàu được và đã bắt đầu thay đổi."
                result="✓ Tích lũy được 20 triệu trong 5 tháng"
                img="https://picsum.photos/seed/woman2/100/100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTERS */}
      <section className="section">
        <div className="container">
          <div className="tc">
            <div className="s-label">Nội dung ebook</div>
            <h2 className="s-title">10 chương · Đầy đủ worksheet và công cụ thực hành</h2>
            <p className="s-sub">Từ chẩn đoán tình trạng tài chính hiện tại đến lộ trình hành động cụ thể — không lý thuyết suông.</p>
          </div>
          <div className="ch-grid">
            <ChapterCard num="Chương 1 · Phần 1" title="Bạn tiêu tiền — hay tiền tiêu bạn?" desc="Đo tỷ lệ tiết kiệm thật sự, nhận diện nhóm tài chính bạn đang ở và biết mình đang đi đúng hay sai hướng." tag="📊 Worksheet bản đồ tài chính" />
            <ChapterCard num="Chương 2 · Phần 1" title="5 cái bẫy người Việt hay sa vào nhất" desc="Lifestyle inflation, mua để gây ấn tượng, tín dụng tiêu dùng, FOMO đầu tư và bẫy 'đợi giàu mới tiết kiệm'." tag="🪤 Phân tích hành vi" />
            <ChapterCard num="Chương 3 · Phần 1" title="Tiền mất thấy được — Cơ hội mất không thấy" desc="Chi phí cơ hội là gì, công thức tính chi phí thật và tại sao 2 triệu/tháng ăn ngoài có thể 'ăn mất' 2,36 tỷ của bạn." tag="🔢 Công cụ tính chi phí cơ hội" />
            <ChapterCard num="Chương 4 · Phần 2" title="Ẩn mình như hổ: sức mạnh của không phô trương" desc="Vì sao người giàu thật sự không phô trương và tư duy 'ẩn mình' giúp tích lũy tài sản hiệu quả hơn." tag="🐯 Tư duy tài chính" />
            <ChapterCard num="Chương 5 · Phần 2" title="Tài sản sinh lời vs Tài sản ăn mòn" desc="Phân biệt tài sản thật và giả, cách đánh giá danh mục hiện tại và mục tiêu ≥60% tài sản sinh lời." tag="✅ Checklist phân loại tài sản" />
            <ChapterCard num="Chương 6 · Phần 2" title="Hệ thống 3 tài khoản" desc="Tự động hóa tài chính cá nhân — thiết lập một lần, vận hành cả đời. Hướng dẫn cụ thể với từng ngân hàng." tag="🏦 Hướng dẫn từng bước" />
            <ChapterCard num="Chương 7 · Phần 3" title="Lộ trình 12 tháng thoát nợ tiêu dùng" desc="Kế hoạch cụ thể từng tháng: từ kiểm kê nợ, áp dụng tuyết lở/quả cầu tuyết đến hoàn toàn tự do." tag="📅 Lịch trình 12 tháng" />
            <ChapterCard num="Chương 8 · Phần 3" title="100 Triệu Đầu Tiên" desc="Lộ trình thực tế từ số 0 đến cột mốc 100 triệu — tại sao 100 triệu đầu tiên là khó nhất và cách vượt qua." tag="🎯 Kế hoạch cá nhân hóa" />
            <ChapterCard num="Chương 9 · Phần 3" title="Khi nền vững: bắt đầu đầu tư thế nào?" desc="Các kênh đầu tư phù hợp người mới, chiến lược DCA, danh mục mẫu và con đường đến tự do tài chính." tag="📈 Danh mục đầu tư mẫu" />
            <ChapterCard num="Chương 10 · Phần 3" title="7 Ngày Đầu Tiên: Kiếm 1–3 Triệu Từ Số 0" desc="5 con đường thực chiến kiếm tiền thêm không cần vốn, kế hoạch từng ngày và bài tập kiểm kê tài sản." tag="🚀 Kế hoạch hành động 7 ngày" />
          </div>
          <div className="bonus-strip !mt-0">
            <div className="col-span-full bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.22)] rounded-lg p-4 mb-0.5 text-center">
              <div className="text-[11px] font-extrabold tracking-[3px] text-[var(--gold)] uppercase mb-2">🎁 Kèm theo khi mua hôm nay — Miễn phí</div>
              <p className="text-[15px] text-[rgba(255,255,255,0.8)] leading-relaxed m-0">Bạn không chỉ nhận ebook — bạn nhận cả <strong className="text-white">bộ công cụ thực hành đầy đủ</strong> để bắt tay vào hành động ngay từ ngày đầu tiên:</p>
            </div>
            <div className="bonus-item"><div className="bonus-ico">📊</div><div className="bonus-nm">Worksheet Bản Đồ Tài Chính</div><div className="bonus-ds">Điền số liệu thật, biết ngay tình trạng và cần làm gì tiếp theo</div></div>
            <div className="bonus-item"><div className="bonus-ico">✅</div><div className="bonus-nm">Checklist 12 Tháng Thoát Nợ</div><div className="bonus-ds">Đánh dấu từng mục, theo dõi tiến độ mỗi tháng</div></div>
            <div className="bonus-item"><div className="bonus-ico">🔢</div><div className="bonus-nm">Công Cụ Tính Toán Tích Hợp</div><div className="bonus-ds">Chi phí cơ hội, thời gian đạt 100 triệu, tỷ lệ tiết kiệm</div></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section s-alt">
        <div className="container">
          <div className="tc">
            <div className="s-label">Độc giả nói gì</div>
            <h2 className="s-title">Kết quả thật từ người thật</h2>
            <p className="s-sub">Không phải lời hứa chung chung — đây là những gì độc giả đạt được sau khi áp dụng.</p>
          </div>
          <div className="test-grid">
            <TestimonialCard
              stars={5}
              text="Đọc xong chương 3 mới hiểu tại sao mình không bao giờ giàu được — không phải vì thu nhập thấp, mà vì không nhìn thấy chi phí thật sự của những quyết định mỗi ngày."
              name="Nguyễn Minh Tuấn"
              role="Nhân viên kinh doanh, 27 tuổi"
              result="✓ Cắt 3 triệu chi tiêu không cần thiết/tháng"
              img="https://picsum.photos/seed/man2/100/100"
            />
            <TestimonialCard
              stars={5}
              text="Hệ thống 3 tài khoản thay đổi hoàn toàn cách mình quản lý tiền. Chỉ mất 1 buổi để thiết lập, và từ đó tháng nào mình cũng tiết kiệm được mà không cần cố gắng."
              name="Trần Lan Hương"
              role="Giáo viên, 31 tuổi"
              result="✓ Tiết kiệm ổn định 4,5 triệu/tháng"
              img="https://picsum.photos/seed/woman1/100/100"
            />
            <TestimonialCard
              stars={5}
              text="Đang trả góp xe và không biết bắt đầu từ đâu. Lộ trình 12 tháng trong chương 7 cho mình thấy chính xác mình cần làm gì từng tháng. Tháng 4 mình đã trả hết 1 khoản nợ rồi."
              name="Lê Minh Khoa"
              role="Kỹ sư, 29 tuổi"
              result="✓ Trả hết nợ tiêu dùng sau 4 tháng"
              img="https://picsum.photos/seed/man1/100/100"
            />
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="section">
        <div className="container">
          <div className="tc">
            <div className="s-label">Dành cho ai</div>
            <h2 className="s-title">Ebook này phù hợp với bạn không?</h2>
          </div>
          <div className="whom-grid">
            <div>
              <div className="whom-col-title">✅ Phù hợp nếu bạn…</div>
              <ul className="whom-list">
                <li><span>✅</span> Thu nhập 8–20 triệu/tháng, cuối tháng không còn dư nhiều</li>
                <li><span>✅</span> Muốn tiết kiệm nhưng không biết bắt đầu từ đâu</li>
                <li><span>✅</span> Đang có nợ tiêu dùng và muốn thoát ra có kế hoạch</li>
                <li><span>✅</span> Muốn có thêm thu nhập nhưng không có vốn ban đầu</li>
                <li><span>✅</span> Cần một hệ thống, không cần thêm lý thuyết chung chung</li>
              </ul>
              <div className="mt-5">
                <div className="whom-col-title">❌ Không phù hợp nếu bạn…</div>
                <ul className="whom-list">
                  <li><span>❌</span> Muốn 'làm giàu nhanh' hay tìm bí kíp đầu cơ ngắn hạn</li>
                  <li><span>❌</span> Đã có nền tảng tài chính vững và đang đầu tư chuyên sâu</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="whom-box">
                <div className="whom-box-title">⏱ Bạn cần bao lâu để có 100 triệu?</div>
                <p className="text-[12px] text-[rgba(255,255,255,0.5)] mb-4">Tính với lãi suất tiết kiệm 6%/năm</p>
                <ProgressRow label="2 triệu/th" percent={30} time="~4 năm" />
                <ProgressRow label="3 triệu/th" percent={48} time="~2,7 năm" />
                <ProgressRow label="5 triệu/th" percent={68} time="~1,7 năm" />
                <ProgressRow label="8 triệu/th" percent={88} time="~1,1 năm" />
                <div className="mt-4.5 p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-lg text-[12px] text-[rgba(255,255,255,0.7)]">
                  💡 <strong className="text-[var(--gold)]">Bài học quan trọng nhất:</strong> Tăng số tiền tiết kiệm mỗi tháng tác động mạnh hơn nhiều so với tối ưu lãi suất.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section s-alt">
        <div className="container">
          <div className="tc">
            <div className="s-label">Câu hỏi thường gặp</div>
            <h2 className="s-title">Bạn đang thắc mắc điều gì?</h2>
          </div>
          <div className="faq-list">
            <FaqItem q="Tôi nhận ebook bằng cách nào sau khi thanh toán?" a="Sau khi xác nhận thanh toán (thường trong vòng 15–30 phút trong giờ hành chính), ebook sẽ được gửi đến email bạn cung cấp. File ebook có thể mở trên mọi trình duyệt, mọi thiết bị, không cần cài app." />
            <FaqItem q="Ebook này phù hợp với người thu nhập thấp không?" a="Hoàn toàn phù hợp. Ebook được thiết kế cho người thu nhập 8–20 triệu/tháng — đây là khoảng thu nhập mà hầu hết sách tài chính bỏ qua. Các công cụ và lộ trình đều có thể điều chỉnh theo mức thu nhập cụ thể." />
            <FaqItem q="Tôi đã đọc nhiều sách tài chính rồi, ebook này có gì khác?" a="Hầu hết sách tài chính được dịch từ bối cảnh Mỹ hoặc châu Âu — không phù hợp với người Việt Nam. Ebook này viết riêng cho người Việt với thu nhập thực tế, kèm worksheet và công cụ tính toán cụ thể." />
            <FaqItem q="Tôi đang có nợ, liệu có nên mua ebook về tiết kiệm không?" a="Đây là lúc thích hợp nhất. Chương 7 dành riêng cho lộ trình 12 tháng thoát nợ tiêu dùng với kế hoạch từng tháng. Chương 6 giúp bạn vừa trả nợ vừa xây dựng khoản đệm tài chính tối thiểu song song." />
            <FaqItem q="Có được hoàn tiền nếu không hài lòng không?" a="Vui lòng liên hệ qua email trong vòng 48 giờ sau khi nhận ebook nếu không hài lòng với nội dung. Chúng tôi sẽ xem xét từng trường hợp cụ thể và hỗ trợ bạn tốt nhất." />
            <FaqItem q="Tôi có thể đọc ebook trên điện thoại không?" a="Hoàn toàn được. Ebook tương thích mọi thiết bị — điện thoại, máy tính bảng, laptop. Chỉ cần mở bằng trình duyệt Chrome, Safari hoặc Firefox, không cần cài thêm bất kỳ phần mềm nào." />
          </div>
        </div>
      </section>

      {/* CAM KẾT */}
      <div className="cam-ket">
        <div className="container">
          <div className="cam-box">
            <div className="cam-ttl">Cam kết cho bạn</div>
            <p className="cam-txt">Nếu bạn đọc xong mà vẫn không hiểu rõ tiền của mình đang đi đâu → bạn có thể liên hệ để được hỗ trợ hoàn tiền.<br /><strong>Bạn không có gì để mất.</strong></p>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="final">
        <div className="final-bg"></div>
        <div className="container relative z-[2] text-center">
          <div className="s-label justify-center flex">Bắt đầu ngay hôm nay</div>
          <h2 className="final-title">
            6 tháng nữa, bạn sẽ ở 1 trong 2 vị trí:<br />
            <span className="text-[0.75em] font-bold text-[rgba(255,255,255,0.7)]">❌ Vẫn đi làm — vẫn không có tiền &nbsp;&nbsp; ❌ Vẫn kiếm — vẫn tiêu hết</span><br />
            <span className="text-[0.65em] text-[var(--gold)] tracking-[2px] font-extrabold">HOẶC</span><br />
            <span className="text-[0.75em] font-bold text-[rgba(255,255,255,0.7)]">✅ Bắt đầu giữ được tiền &nbsp;&nbsp; ✅ Có lộ trình rõ ràng đến 100 triệu</span><br />
            <em className="text-[0.7em] font-semibold">Quyết định nằm ở việc bạn có bắt đầu hôm nay hay không.</em>
          </h2>
          <p className="final-sub">Đừng để thêm một tháng nữa trôi qua mà không biết tiền chạy đi đâu.</p>
          <div className="price-alert">⏰ Giá 79k chỉ áp dụng hiện tại, có thể tăng lên 149k</div><br />
          <div className="final-price-box">
            <span className="fp-old">199.000đ</span>
            <span className="fp-real">79.000đ</span>
            <span className="fp-badge">−60%</span>
          </div><br />
          <div className="bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.22)] rounded-lg p-4 max-w-[540px] mx-auto mb-6 text-left">
            <div className="text-[12px] font-extrabold tracking-[2px] text-[var(--gold)] uppercase mb-2.5 text-center">Bạn sẽ nhận được gì với 79.000đ?</div>
            <div className="text-[14px] text-[rgba(255,255,255,0.75)] leading-relaxed">
              ✦ 10 chương tài chính cá nhân cho người Việt<br />
              ✦ Worksheet Bản Đồ Tài Chính (điền ngay, biết ngay)<br />
              ✦ Checklist 12 Tháng Thoát Nợ Tiêu Dùng<br />
              ✦ Công Cụ Tính Toán: chi phí cơ hội, lộ trình 100 triệu<br />
              ✦ Lộ trình hành động 7 ngày đầu tiên<br />
              <strong className="text-[var(--gold)] text-[13px]">→ Tổng giá trị thực: 199.000đ — hôm nay chỉ 79.000đ</strong>
            </div>
          </div>
          <button className="final-btn" onClick={openModal}>NHẬN EBOOK NGAY — 79.000Đ</button>
          <p className="social-proof">⭐⭐⭐⭐⭐ Hơn <strong className="text-[rgba(255,255,255,0.7)]">200+ người</strong> đã tải và áp dụng ebook này — đánh giá trung bình 4.9/5</p>
          <div className="guarantee">🔒 Thanh toán an toàn qua chuyển khoản &nbsp;·&nbsp; Giao qua email trong 15–30 phút</div>
          <div className="mt-4.5 bg-[rgba(255,243,224,0.08)] border-[1.5px] border-[rgba(201,168,76,0.35)] rounded-lg p-4 max-w-[520px] mx-auto relative">
            <div className="text-[11px] font-extrabold tracking-[2px] text-[#C9A84C] uppercase mb-2">🛡️ Cam kết của chúng tôi</div>
            <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed m-0">Nếu bạn đọc xong và cảm thấy không xứng đáng với 79k — <strong className="text-white">nhắn tin cho chúng tôi</strong>. Chúng tôi sẽ hoàn lại toàn bộ, không hỏi lý do. Chúng tôi tự tin vào giá trị ebook này mang lại.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#07070e] px-10 py-7.5 flex items-center justify-between border-t border-[rgba(201,168,76,0.1)]">
        <div>
          <div className="ft-brand">100 <span>Triệu</span> Đầu Tiên</div>
          <div className="ft-sub">Ẩn mình như hổ — tích lũy như rồng</div>
        </div>
        <div>
          <a className="ft-link" onClick={openModal}>Mua ngay — 79.000đ</a>
          <div className="ft-sub mt-1">Giao ebook qua email trong 15–30 phút</div>
        </div>
      </footer>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="toast show"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-ov block" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-box"
            >
              <div className="modal-top">
                <button className="modal-close" onClick={closeModal}><X size={18} /></button>
                <div className="modal-top-badge">Đặt mua ebook</div>
                <div className="modal-top-title">100 Triệu Đầu Tiên</div>
                <div className="modal-top-price">
                  <span className="mtp-old">199.000đ</span>
                  <span className="mtp-real">79.000đ</span>
                  <span className="mtp-badge">−60%</span>
                </div>
              </div>
              <div className="modal-steps">
                <div className={`modal-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}><div className="step-circle">1</div>Thông tin</div>
                <div className={`modal-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}><div className="step-circle">2</div>Thanh toán</div>
                <div className={`modal-step ${step === 3 ? 'active' : ''}`}><div className="step-circle">3</div>Xác nhận</div>
              </div>

              {/* PANE 1 */}
              {step === 1 && (
                <div className="modal-pane active">
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input className={`form-input ${errors.name ? 'err' : ''}`} id="inp-name" type="text" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleInputChange} />
                    {errors.name && <div className="form-err show">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email nhận ebook *</label>
                    <input className={`form-input ${errors.email ? 'err' : ''}`} id="inp-email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} />
                    {errors.email && <div className="form-err show">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input className={`form-input ${errors.phone ? 'err' : ''}`} id="inp-phone" type="tel" placeholder="0912 345 678" value={formData.phone} onChange={handleInputChange} />
                    {errors.phone && <div className="form-err show">{errors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bạn biết đến ebook qua đâu?</label>
                    <select className="form-input" id="inp-source" value={formData.source} onChange={handleInputChange}>
                      <option value="">Chọn nguồn...</option>
                      <option>Facebook</option>
                      <option>TikTok</option>
                      <option>Bạn bè giới thiệu</option>
                      <option>Google</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <button className="btn-p" onClick={validateStep1}>Tiếp theo — Thanh toán →</button>
                </div>
              )}

              {/* PANE 2 */}
              {step === 2 && (
                <div className="modal-pane active">
                  <div className="bank-block">
                    <div className="bank-header"><div className="vcb-logo">VCB</div><div className="bank-name">Vietcombank</div></div>
                    <div className="pfield">
                      <span className="pf-lbl">Số tài khoản</span>
                      <span className="pf-val">
                        <span>0111 0003 00347</span>
                        <button className={`copy-btn ${isCopyingAcc ? 'copied' : ''}`} onClick={() => copyToClipboard('0111000300347', 'acc')}>
                          {isCopyingAcc ? '✅ Đã chép' : '📋 Sao chép'}
                        </button>
                      </span>
                    </div>
                    <div className="pfield"><span className="pf-lbl">Chủ tài khoản</span><span className="pf-val">PHAM MINH TUNG</span></div>
                    <div className="pfield"><span className="pf-lbl">Số tiền</span><span className="pf-val accent">79.000đ</span></div>
                    <div className="pfield">
                      <span className="pf-lbl">Nội dung CK</span>
                      <span className="pf-val">
                        <span>100TRIEU {formData.phone.replace(/\s/g, '')}</span>
                        <button className={`copy-btn ${isCopyingMsg ? 'copied' : ''}`} onClick={() => copyToClipboard(`100TRIEU ${formData.phone.replace(/\s/g, '')}`, 'msg')}>
                          {isCopyingMsg ? '✅ Đã chép' : '📋 Sao chép'}
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="note-box">
                    <b>Hướng dẫn 4 bước:</b>
                    <ol className="steps-guide">
                      <li>Mở app ngân hàng, chọn <b>Chuyển tiền</b></li>
                      <li>Nhập số TK trên và số tiền <b>79.000đ</b></li>
                      <li>Nội dung: <b>100TRIEU {formData.phone.replace(/\s/g, '')}</b></li>
                      <li>Chụp màn hình rồi nhấn <b>Hoàn thành</b> bên dưới</li>
                    </ol>
                  </div>
                  <button className="btn-p mt-3.5" onClick={handleConfirmPayment}>✅ Tôi đã chuyển khoản xong</button>
                  <button className="btn-s" onClick={() => setStep(1)}>← Quay lại</button>
                </div>
              )}

              {/* PANE 3 */}
              {step === 3 && (
                <div className="modal-pane active">
                  <div className="confirm-header">
                    <div className="confirm-icon">🎉</div>
                    <div className="confirm-title">Đặt hàng thành công!</div>
                    <div className="confirm-sub">Chúng tôi đang xác nhận thanh toán của bạn</div>
                  </div>
                  <div className="confirm-sum">
                    <div className="confirm-row"><span className="confirm-lbl">Họ tên</span><span>{formData.name}</span></div>
                    <div className="confirm-row"><span className="confirm-lbl">Email</span><span>{formData.email}</span></div>
                    <div className="confirm-row"><span className="confirm-lbl">Số điện thoại</span><span>{formData.phone}</span></div>
                    <div className="confirm-row"><span className="confirm-lbl">Mã đơn</span><span className="text-[var(--gold-d)] font-bold">{orderId}</span></div>
                    <div className="confirm-row"><span className="confirm-lbl">Sản phẩm</span><span>100 Triệu Đầu Tiên</span></div>
                    <div className="confirm-row"><span className="confirm-lbl">Tổng tiền</span><span>79.000đ</span></div>
                  </div>
                  <div className="delivery-note">📥 Link ebook đã được gửi về email của bạn. Bạn cũng có thể tải trực tiếp bên dưới.</div>
                  <a href={EBOOK_LINK} target="_blank" rel="noreferrer" className="dl-btn !flex">
                    <Download size={18} /> Tải Ebook Ngay
                  </a>
                  <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" className="zalo-btn">
                    <MessageCircle size={18} /> Chat Zalo nếu cần hỗ trợ
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryCard({ name, role, quote, result, img }: { name: string, role: string, quote: string, result: string, img: string }) {
  return (
    <motion.div
      className="story-card"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="av">
        <img src={img} alt={name} referrerPolicy="no-referrer" />
      </div>
      <div>
        <div className="s-name">{name}</div>
        <div className="s-role">{role}</div>
        <div className="s-quote">"{quote}"</div>
        <span className="s-result">{result}</span>
      </div>
    </motion.div>
  );
}

function ChapterCard({ num, title, desc, tag }: { num: string, title: string, desc: string, tag: string }) {
  return (
    <motion.div
      className="ch-card"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="ch-num">{num}</div>
      <div className="ch-title">{title}</div>
      <div className="ch-desc">{desc}</div>
      <span className="ch-tag">{tag}</span>
    </motion.div>
  );
}

function TestimonialCard({ stars, text, name, role, result, img }: { stars: number, text: string, name: string, role: string, result: string, img: string }) {
  return (
    <motion.div
      className="test-card"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="test-stars">{'★'.repeat(stars)}</div>
      <p className="test-text">"{text}"</p>
      <div className="test-row">
        <div className="av48">
          <img src={img} alt={name} referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="t-name">{name}</div>
          <div className="t-role">{role}</div>
          <div className="t-result">{result}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressRow({ label, percent, time }: { label: string, percent: number, time: string }) {
  return (
    <div className="inc-row">
      <span className="inc-lbl">{label}</span>
      <div className="inc-bar-w">
        <motion.div
          className="inc-bar"
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        ></motion.div>
      </div>
      <span className="inc-time">{time}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-q">
        {q}
        <span className="tog">{isOpen ? '−' : '+'}</span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="faq-a">{a}</div>
      </motion.div>
    </div>
  );
}
