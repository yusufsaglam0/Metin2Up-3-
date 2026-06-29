import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import VipSection from '../components/VipSection';
import ForumCategory from '../components/ForumCategory';
import StatsBar from '../components/StatsBar';
import api from '../lib/api';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <VipSection />
      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : (
        categories.map((cat) => <ForumCategory key={cat.id} category={cat} />)
      )}
      <StatsBar />
    </PageLayout>
  );
}
