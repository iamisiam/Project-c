'use client';

import { useState, useEffect } from 'react';

interface Frustration {
  id: number;
  content: string;
  shared: boolean;
  escalated: boolean;
  aiAdvice?: string;
}

export default function FrustrationsPage() {
  const [myFrustrations, setMyFrustrations] = useState<Frustration[]>([]);
  const [sharedFrustrations, setSharedFrustrations] = useState<Frustration[]>([]);
  const [newFrustration, setNewFrustration] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFrustrations();
  }, []);

  const loadFrustrations = async () => {
    try {
      const res = await fetch('/api/frustrations');
      const data = await res.json();
      setMyFrustrations(data.myFrustrations || []);
      setSharedFrustrations(data.sharedFrustrations || []);
    } catch (error) {
      console.error('Error loading frustrations:', error);
    }
  };

  const addFrustration = async () => {
    if (!newFrustration.trim()) return;

    setLoading(true);
    try {
      await fetch('/api/frustrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newFrustration }),
      });
      setNewFrustration('');
      loadFrustrations();
    } catch (error) {
      console.error('Error adding frustration:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareFrustration = async (id: number) => {
    try {
      await fetch(`/api/frustrations/${id}/share`, { method: 'POST' });
      loadFrustrations();
    } catch (error) {
      console.error('Error sharing frustration:', error);
    }
  };

  const escalateFrustrations = async () => {
    setLoading(true);
    try {
      await fetch('/api/frustrations/escalate', { method: 'POST' });
      loadFrustrations();
    } catch (error) {
      console.error('Error escalating frustrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Share Your Feelings 💭</h1>

        {/* Add new frustration */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">What&apos;s bothering you?</h2>
          <textarea
            value={newFrustration}
            onChange={(e) => setNewFrustration(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            rows={4}
            placeholder="Share your thoughts..."
          />
          <button
            onClick={addFrustration}
            disabled={loading}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Frustration'}
          </button>
        </div>

        {/* My frustrations */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Private Frustrations</h2>
          {myFrustrations.length === 0 ? (
            <p className="text-gray-500">No frustrations yet. Start sharing!</p>
          ) : (
            myFrustrations.map((f) => (
              <div key={f.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                <p className="text-gray-800 mb-2">{f.content}</p>
                {!f.shared && (
                  <button
                    onClick={() => shareFrustration(f.id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Share with Partner
                  </button>
                )}
                {f.shared && (
                  <span className="text-green-600 text-sm">Shared ✓</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Shared frustrations */}
        {sharedFrustrations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Shared Frustrations</h2>
            {sharedFrustrations.map((f) => (
              <div key={f.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                <p className="text-gray-800 mb-2">{f.content}</p>
                {f.escalated && f.aiAdvice && (
                  <div className="bg-blue-50 p-4 rounded-md mt-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Dr. Relationship says:</h3>
                    <p className="text-blue-700 whitespace-pre-line">{f.aiAdvice}</p>
                  </div>
                )}
              </div>
            ))}
            {!sharedFrustrations.some(f => f.escalated) && (
              <button
                onClick={escalateFrustrations}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Getting Advice...' : 'Escalate to Dr. Relationship'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}