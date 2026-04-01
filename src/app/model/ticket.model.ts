export interface Ticket {
  id: number;
  user_id: number;
  title: string;
  type_of_report: 'complain' | 'suggestion';
  category: 'facilities' | 'faculty' | 'administration' | 'others';
  description: string;
  attachment: string | null;
  status: 'submitted' | 'in_progress' | 'resolved' | 'closed';
  create_time: Date;
}

export interface CreateTicket {
  user_id: number;
  title: string;
  type_of_report: string;
  category: string;
  description: string;
  attachment?: string | null;
}