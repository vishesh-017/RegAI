"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function globalSearchAction(query: string) {
  if (!query || query.length < 2) return [];

  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) return [];

  const lowercaseQuery = query.toLowerCase();

  // Search Circulars
  const circulars = await prisma.circular.findMany({
    where: { 
      organizationId: orgId,
      OR: [
        { title: { contains: lowercaseQuery } },
        { referenceNumber: { contains: lowercaseQuery } }
      ]
    },
    take: 5,
    select: { id: true, title: true, referenceNumber: true }
  });

  // Search Obligations
  const obligations = await prisma.obligation.findMany({
    where: { 
      organizationId: orgId,
      OR: [
        { title: { contains: lowercaseQuery } },
        { description: { contains: lowercaseQuery } }
      ]
    },
    take: 5,
    select: { id: true, title: true, circularId: true }
  });

  // Search Tasks
  const tasks = await prisma.workflowTask.findMany({
    where: { 
      organizationId: orgId,
      OR: [
        { department: { contains: lowercaseQuery } },
        { comments: { contains: lowercaseQuery } }
      ]
    },
    take: 5,
    select: { id: true, status: true, obligation: { select: { title: true, circularId: true } } }
  });

  // Combine and format results
  const results = [
    ...circulars.map(c => ({
      id: c.id,
      type: 'Circular',
      title: c.title,
      subtitle: c.referenceNumber,
      url: `/circulars/${c.id}`
    })),
    ...obligations.map(o => ({
      id: o.id,
      type: 'Obligation',
      title: o.title,
      subtitle: 'Regulatory Requirement',
      url: `/circulars/${o.circularId}`
    })),
    ...tasks.map(t => ({
      id: t.id,
      type: 'Task',
      title: t.obligation?.title || 'Workflow Task',
      subtitle: `Status: ${t.status}`,
      url: t.obligation?.circularId ? `/circulars/${t.obligation.circularId}` : `/act`
    }))
  ];

  return results;
}
