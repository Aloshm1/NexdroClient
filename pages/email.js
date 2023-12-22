import React from 'react'

function Email() {
  return (
    <div>
        <div>
        <div style={{margin: "20px"}}>
        1. Email Verify / Welcome Message <br /> <br />

Subject: Welcome to Nexdro | Verify Email<br />
Content: Welcome to Drone<br /><br />
    
Please Click the link below to verify your mail Id.<br /><br />

$url<br /><br />

This Link expires in 1 hour<br /><br />

Thank You<br />
Team Nexdro<br /><br />

2. Password Recovery<br /><br />

Subject: Recover your Nexdro Password<br />
Content: Hello Nexdro User<br /><br />
          
Please Click the link below to recover your password.<br /><br />
      
$url<br /><br />
      
The above Link expires in 1 hour<br /><br />
      
Thank You<br />
Team Nexdro
<br /><br />
3. Resend Email for verify<br /><br />

Subject: Verify Email<br />
Content: Greetings from Drone<br /><br />
  
Please Click the link below to verify your mail Id.<br /><br />

$url<br /><br />

This Link expires in 1 hour
<br /><br />
Thank You<br />
Team Nexdro<br /><br />

4. Welcome to drone<br /><br />

Subject: Welcome to Drone<br />
Content: Welcome to Drone<br /><br />
    
You have created your account in Nexdro.<br /><br />

Here are your credentials to login.<br /><br />

EmailId: $user.email<br />
Password: $z<br />
Use this credentials or generate new password using forgot password in login page.<br /><br />

Login Now<br />
$process.env.BASE_URL/#/login<br /><br />

Thank You<br />
Team Nexdro<br /><br />

5. Post Comment<br /><br />

Subject: Comment on Post | Nexdro<br />
Content: Greetings from Drone<br /><br />
    
$req.user.name commented on your post as $req.body.comment.<br /><br />
    
Login now to see all the comments.<br /><br />
                
Thank You,<br />
Team Nexdro<br /><br />

6. Image Approval<br /><br />

Subject: Image Approved | Nexdro<br />
Content: Greetings from Drone<br />
    
The Image recently uploaded by you has been successfully approved. Check your dashboard to track downloads and likes.<br /><br />
        
Thank You,<br />
Team Nexdro
<br /><br />
7. Image Rejection<br /><br />

Subject: Image Rejected | Nexdro<br />
Content: Greetings from Drone<br />
        
The Image recently uploaded by you has been rejected. <br /><br />

Reject Reason: $req.body.rejectReason<br /><br />

Check your dashboard for more details.<br /><br />
            
Thank You,<br />
Team Nexdro<br /><br />

8. Enquiry on Service Center<br /><br />

Subject: Enquiry | Nexdro<br />
COntent: Greetings from Drone<br /><br />
  
You have got an enquiry related to your service center.<br /><br />

Below are the details:<br /><br />

Name: $req.body.name<br />
PhoneNo: $req.body.phoneNo<br />
EmailId: $req.body.emailId<br />
Message: $req.body.message<br /><br />
    
Login and check dashboard to track all enquiries.<br /><br />
    
Thank You<br />
Team Nexdro<br /><br />

9. Follow<br /><br />

Subject: Pilot Followed | Nexdro<br />
Content: Greetings from Drone<br /><br />
    
Your profile was followed by $followerUser.name.<br /><br />

Check your dashboard to see all followers and view them<br /><br />
            
Thank You,<br />
Team Nexdro<br /><br />

10. Hire Pilot<br /><br />

Subject: Hire Proposal<br />
Content: Hello $result2.name,<br /><br />

$result3.companyName has sent you a proposal to hire you.<br /><br />

Description : $req.body.message
<br /><br />
Thank You,<br />
Team Nexdro<br /><br />

11. Job Notification <br /><br />

Subject: Job Notification | Nexdro<br />
Content: Greetings from Drone<br /><br />
  
Here are your job Notifications.<br /><br /><br />
  

  
JobTitle : $item.jobTitle<br />
jobIndustry: $item.industry<br />
jobType: $item.jobType<br /><br />
  
    

Login Now and apply for getting Hired.<br /><br />

Thank You,<br /><br />
Team Nexdro<br /><br />

12. Message by $name | Nexdro<br /><br />

Dear $name,<br /><br />

Yaseen Ahmed messaged you while you were away.<br />
Message: $message<br /><br />

Thank You,<br />
Team Nexdro<br /><br />

13. Issue Resolved | Nexdro<br /><br />

Dear $name,<br /><br />

Your issues raised by you has been resolved. Please check your dashboard for more details<br />
Thank You,<br />
Team Nexdro<br /><br />
        </div>
    </div>
    </div>
  )
}

export default Email