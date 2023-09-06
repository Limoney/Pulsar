import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    protected navbarOpen: boolean = false;

    ngOnInit(): void 
    {
        const value = sessionStorage.getItem("navbarOpen");
        if(value)
        {
            const navbarOpen = JSON.parse(value);
            if(navbarOpen)
            {
                this.open();
            }
            else
            {
                this.close()
            }
        }
        else
        {
            this.open();
        }
    }

    protected toggle()
    {
        this.navbarOpen = !this.navbarOpen;
        sessionStorage.setItem("navbarOpen",this.navbarOpen.toString());
        console.log(this.navbarOpen);
    }

    protected close()
    {
        this.navbarOpen = false;
        sessionStorage.setItem("navbarOpen",this.navbarOpen.toString());
    }

    protected open()
    {
        this.navbarOpen = true;
        sessionStorage.setItem("navbarOpen",this.navbarOpen.toString());
    }
}
