import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  metrics = [
    { title: 'Total Content', value: '1,250', change: '+10%', color: 'green' },
    { title: 'Active Users', value: '8,750', change: '+5%', color: 'green' },
    { title: 'Average Watch Time', value: '2h 30m', change: '-2%', color: 'red' }
  ];

  realTimeActivity = [
    { date: '2024-03-15', activity: 'New User Registration', details: 'New user, Emily Carter, joined' },
    { date: '2024-03-15', activity: 'Content Upload', details: 'Uploaded \'The Cosmic Odyssey\' documentary' },
    { date: '2024-03-14', activity: 'User Registration', details: 'New user, David Lee, joined' },
    { date: '2024-03-13', activity: 'Content Update', details: 'Updated metadata for \'Mysteries of the Deep\'' },
    { date: '2024-03-12', activity: 'Flagged Content', details: '\'Urban Legends\' flagged for review' }
  ];

  recentActivity = [
    { date: '2024-03-11', activity: 'User Engagement', details: 'Increased watch time for \'Urban Legends\'' },
    { date: '2024-03-10', activity: 'System Maintenance', details: 'Completed scheduled server maintenance' },
    { date: '2024-03-09', activity: 'New Content Upload', details: 'Uploaded \'The Cosmic Odyssey\' documentary' },
    { date: '2024-03-08', activity: 'User Registration', details: 'New user, Olivia Bennett, joined' }
  ];
}
