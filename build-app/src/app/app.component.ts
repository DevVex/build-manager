import { ErrorHandler, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends ErrorHandler{
  appInfo:any = {name: 'build-manager', version: '0.0.0'};
  builds:any = [];
  newBuild = { bundleId: '', buildNumber: ''};
  errorMessage = '';

  constructor(private http: HttpClient) {
    super()
    this.getInfo();
    this.getBuilds();
  }


  //catch all errors and alert
  handleError(error) {
    super.handleError(error);
    let message = error.error.message ? error.error.message : error.message;
    this.errorMessage = message;
    alert(this.errorMessage);
  }

  getInfo(){
    this.http.get('/api/version') 
      .subscribe(result => {
        this.appInfo = result;
      })
  }

  getBuilds(){
    this.http.get('/api/builds') 
      .subscribe(result => {
        this.builds = result;
      })
  }

  updateId(id){
    this.http.get(`/api/read?bundle_id=${id}`)
      .subscribe(result => {
        let buildObj = this.builds.find( build => build.bundleId === id );
        //update if exists, or add
        if(buildObj){
          buildObj.buildNumber = result;
        }else{
          this.builds.push({bundleId: id, buildNumber: result})
        }
      })
  }

  setNewBuild(build){
    this.setBuild(Object.assign({}, build));
    //reset fields
    build.bundleId = '';
    build.buildNumber = '';
  }

  setBuild(build){
    build.edit ?  build.edit = false : null;
    this.http.post(`/api/set?bundle_id=${build.bundleId}&new_build_number=${build.buildNumber}`, null)
      .subscribe(result => {
        this.updateId(build.bundleId);
      })
  }

  bumpBuild(id){
    this.http.post(`/api/bump?bundle_id=${id}`, null)
      .subscribe(result => {
        this.updateId(id);
      })
  }

}
