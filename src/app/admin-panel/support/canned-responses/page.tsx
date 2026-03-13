"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, AlertCircle, Loader2 } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import ErrorBanner from "@/components/admin/shared/ErrorBanner";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { useSupportStore } from "@/store/useSupportStore";
import supportService from "@/services/support.service";

interface LocalCannedResponse {
  id?: string;
  title: string;
  body: string;
  category?: string;
  isActive: boolean;
}

export default function CannedResponsesPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newResponse, setNewResponse] = useState<LocalCannedResponse>({
    title: "",
    body: "",
    category: "",
    isActive: true
  });
  const [editForm, setEditForm] = useState<LocalCannedResponse>({
    title: "",
    body: "",
    category: "",
    isActive: true
  });

  // Fetch canned responses
  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supportService.getCannedResponses();
      setResponses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch canned responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleCreate = async () => {
    if (!newResponse.title.trim() || !newResponse.body.trim()) return;
    
    try {
      const created = await supportService.createCannedResponse(newResponse);
      setResponses(prev => [...prev, created]);
      setNewResponse({ title: "", body: "", category: "", isActive: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create canned response");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.title.trim() || !editForm.body.trim()) return;
    
    try {
      const updated = await supportService.updateCannedResponse(id, editForm);
      setResponses(prev => prev.map(r => r.id === id ? updated : r));
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update canned response");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this canned response?")) return;
    
    try {
      await supportService.deleteCannedResponse(id);
      setResponses(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete canned response");
    }
  };

  const startEditing = (response: any) => {
    setEditingId(response.id);
    setEditForm({
      title: response.title,
      body: response.body,
      category: response.category || "",
      isActive: response.isActive
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: "", body: "", category: "", isActive: true });
  };

  const groupedResponses: Record<string, typeof responses> = responses.reduce((acc, response) => {
    const category = response.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(response);
    return acc;
  }, {} as Record<string, typeof responses>);

  return (
    <div>
      <PageHeader
        title="Canned Responses"
        subtitle={`${responses.length} saved responses`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-panel/dashboard" },
          { label: "Support", href: "/admin-panel/support" },
          { label: "Canned Responses" }
        ]}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Add New Response */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h3 className="text-lg font-bold text-charcoal mb-4">Add New Canned Response</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newResponse.title}
            onChange={(e) => setNewResponse(prev => ({ ...prev, title: e.target.value }))}
            className="px-4 py-3 text-sm rounded-lg border border-border text-charcoal placeholder:text-muted focus:outline-none focus:border-charcoal"
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={newResponse.category}
            onChange={(e) => setNewResponse(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-3 text-sm rounded-lg border border-border text-charcoal placeholder:text-muted focus:outline-none focus:border-charcoal"
          />
        </div>
        <textarea
          placeholder="Response body..."
          value={newResponse.body}
          onChange={(e) => setNewResponse(prev => ({ ...prev, body: e.target.value }))}
          rows={4}
          className="w-full mt-4 px-4 py-3 text-sm rounded-lg border border-border text-charcoal placeholder:text-muted focus:outline-none focus:border-charcoal resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={newResponse.isActive}
              onChange={(e) => setNewResponse(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 accent-charcoal"
            />
            Active
          </label>
          <Button 
            variant="primary" 
            onClick={handleCreate}
            disabled={!newResponse.title.trim() || !newResponse.body.trim() || loading}
          >
            <Plus size={16} />
            Add Response
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-charcoal" />
        </div>
      )}

      {/* Responses List */}
      {!loading && Object.keys(groupedResponses).length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupedResponses).map(([category, categoryResponses]: [string, any[]]) => (
            <div key={category} className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-gray-50">
                <h3 className="font-semibold text-charcoal">{category}</h3>
                <p className="text-sm text-muted">{categoryResponses.length} responses</p>
              </div>
              
              <div className="divide-y divide-border">
                {categoryResponses.map((response) => (
                  <div key={response.id} className="p-6">
                    {editingId === response.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            className="px-3 py-2 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                          />
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="px-3 py-2 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                          />
                        </div>
                        <textarea
                          value={editForm.body}
                          onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-muted">
                            <input
                              type="checkbox"
                              checked={editForm.isActive}
                              onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                              className="w-4 h-4 accent-charcoal"
                            />
                            Active
                          </label>
                          <div className="flex gap-2">
                            <Button 
                              variant="emerald" 
                              size="sm"
                              onClick={() => handleUpdate(response.id)}
                            >
                              <Save size={14} />
                              Save
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={cancelEditing}
                            >
                              <X size={14} />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-charcoal">{response.title}</h4>
                            {response.category && (
                              <span className="inline-block mt-1 text-xs text-muted bg-gray-100 px-2 py-1 rounded">
                                {response.category}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => startEditing(response)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDelete(response.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted whitespace-pre-wrap">{response.body}</p>
                        {!response.isActive && (
                          <span className="inline-block mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && responses.length === 0 && (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Plus className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-charcoal mb-2">No canned responses yet</h3>
          <p className="text-muted">Create your first canned response to save time when replying to customers.</p>
        </div>
      )}
    </div>
  );
}