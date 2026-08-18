'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/auth-context';
import type { Review } from '@/types/database';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function StarRating({
  value,
  onChange,
  size = 'md',
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (interactive && hovered ? hovered : value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Icon
              icon={filled ? 'solar:star-bold' : 'solar:star-linear'}
              className={`${sizeClass} ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : undefined;

  const loadReviews = useCallback(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews ?? []);
        setAverage(data.average ?? 0);
        setCount(data.count ?? 0);
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (myReview) {
      setFormRating(myReview.rating);
      setFormComment(myReview.comment ?? '');
    }
  }, [myReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formRating === 0) {
      setError('Vui lòng chọn số sao đánh giá.');
      return;
    }

    setIsSubmitting(true);
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: formRating, comment: formComment }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Gửi đánh giá thất bại.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    loadReviews();
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Xóa đánh giá này?')) return;
    const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
      setFormRating(0);
      setFormComment('');
      loadReviews();
    } else {
      alert('Xóa thất bại.');
    }
  };

  return (
    <div className="py-16 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-comay-charcoal uppercase mb-8 text-center">
        Đánh Giá Sản Phẩm
      </h2>

      {/* Summary */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-comay-charcoal">{average.toFixed(1)}</span>
          <StarRating value={Math.round(average)} size="lg" />
        </div>
        <p className="text-sm text-gray-500">{count > 0 ? `${count} đánh giá` : 'Chưa có đánh giá nào'}</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Write a review */}
        {user ? (
          <form onSubmit={handleSubmit} className="bg-comay-cream-light/50 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-comay-charcoal">
              {myReview ? 'Cập nhật đánh giá của bạn' : 'Viết đánh giá'}
            </h3>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
            <StarRating value={formRating} onChange={setFormRating} size="lg" />
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors resize-none bg-white"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-comay-green text-white px-6 py-2.5 rounded-full font-semibold hover:bg-comay-green/90 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Đang gửi...' : myReview ? 'Cập nhật' : 'Gửi đánh giá'}
              </button>
              {myReview && (
                <button
                  type="button"
                  onClick={() => handleDelete(myReview.id)}
                  className="text-sm text-red-500 hover:underline font-medium"
                >
                  Xóa đánh giá
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="bg-comay-cream-light/50 rounded-2xl p-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-comay-green font-semibold hover:underline">
              Đăng nhập
            </Link>{' '}
            để viết đánh giá cho sản phẩm này.
          </div>
        )}

        {/* Review list */}
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Đang tải...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Hãy là người đầu tiên đánh giá sản phẩm này.</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-comay-charcoal text-sm">{review.author_name}</p>
                      {review.verified_purchase && (
                        <span className="flex items-center gap-1 text-[11px] text-comay-green bg-comay-green/10 px-2 py-0.5 rounded-full font-medium">
                          <Icon icon="solar:verified-check-bold" className="w-3 h-3" />
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={review.rating} size="sm" />
                      <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
                    </div>
                  </div>
                  {(user?.id === review.user_id || profile?.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Xóa đánh giá"
                    >
                      <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
