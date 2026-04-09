import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { CreateTicket, Ticket } from "../../model/ticket.model";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3000/api/tickets';

  // GET own tickets by user_id
  public async getTickets(userId: number) {
    const url = userId 
      ? `${this.API_URL}?user_id=${userId}`  
      : this.API_URL;                        
    return lastValueFrom(
      this.http.get<Ticket[]>(url)
    );
  }

  // POST new ticket
  public async createTicket(payload: CreateTicket) {
    return lastValueFrom(
      this.http.post<Ticket>(this.API_URL, payload)
    );
  }

  // DELETE ticket
  public async deleteTicket(ticketId: number) {
    return lastValueFrom(
      this.http.delete<void>(`${this.API_URL}/${ticketId}`)
    );
  }
  // ticket status
  public async updateStatus(ticketId: number, status: string) {
    return lastValueFrom(
      this.http.patch<any>(`${this.API_URL}/${ticketId}/status`, { status })
    );
  }

  public async updateTicket(id: number, payload: {
    title: string;
    type_of_report: string;
    category: string;
    description: string;
  }) {
    return lastValueFrom(
      this.http.put<any>(`${this.API_URL}/${id}`, payload)
    );
  }

}