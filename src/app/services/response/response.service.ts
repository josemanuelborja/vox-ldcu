import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3000/api/responses';

  public async getResponses(ticketId: number) {
    return lastValueFrom(
      this.http.get<any[]>(`${this.API_URL}/${ticketId}`)
    );
  }

  public async createResponse(payload: { ticket_id: number, admin_name: string, message: string }) {
    return lastValueFrom(
      this.http.post<any>(this.API_URL, payload)
    );
  }

  public async deleteResponse(responseId: number) {
    return lastValueFrom(
      this.http.delete<void>(`${this.API_URL}/${responseId}`)
    );
  }
}