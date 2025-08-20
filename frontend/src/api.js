const API_URL = import.meta.env.VITE_API_URL || 'https://littlefees.onrender.com';

// Pass clerkId as a parameter for all requests
export async function fetchStudents(sort, clerkId) {
  if (!clerkId) throw new Error('clerkId is required');
  const url = sort
    ? `${API_URL}/api/students?sort=${encodeURIComponent(sort)}&clerkId=${encodeURIComponent(clerkId)}`
    : `${API_URL}/api/students?clerkId=${encodeURIComponent(clerkId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function addStudent(name, clerkId) {
  if (!clerkId) throw new Error('clerkId is required');
  const res = await fetch(`${API_URL}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, clerkId })
  });
  if (!res.ok) throw new Error('Failed to add student');
  return res.json();
}

export async function updateStudent(id, data, clerkId) {
  if (!clerkId) throw new Error('clerkId is required');
  const res = await fetch(`${API_URL}/api/students/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, clerkId })
  });
  if (!res.ok) throw new Error('Failed to update student');
  return res.json();
}

export async function deleteStudent(id, clerkId) {
  if (!clerkId) throw new Error('clerkId is required');
  const res = await fetch(`${API_URL}/api/students/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerkId })
  });
  if (!res.ok) throw new Error('Failed to delete student');
  return res.json();
}

export async function fetchPayments(clerkId) {
  if (!clerkId) throw new Error('clerkId is required');
  const res = await fetch(`${API_URL}/api/students/payments?clerkId=${encodeURIComponent(clerkId)}`);
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
}
