import yagmail
import threading

NOTIFICATION_EMAIL = 'consorcio.unido.notifications@gmail.com'
PASSWORD = 'Cata2525'

HARD_COLOR = '#2C4068'

BASIC_EMAIL_STRUCTURE = '''
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
}

/* Style the header */
header {
  background-color: #666;
  padding: 30px;
  text-align: center;
  font-size: 35px;
  color: white;
}

/* Create two columns/boxes that floats next to each other */
nav {
  float: left;
  width: 30%;
  height: 300px; /* only for demonstration, should be removed */
  background: #ccc;
  padding: 20px;
}

/* Style the list inside the menu */
nav ul {
  list-style-type: none;
  padding: 0;
}

article {
  float: left;
  padding: 20px;
  width: 70%;
  background-color: #f1f1f1;
  height: 300px; /* only for demonstration, should be removed */
}

/* Clear floats after the columns */
section::after {
  content: "";
  display: table;
  clear: both;
}

/* Style the footer */
footer {
  background-color: #777;
  padding: 10px;
  text-align: center;
  color: white;
}

/* Responsive layout - makes the two columns/boxes stack on top of each other instead of next to each other, on small screens */
@media (max-width: 600px) {
  nav, article {
    width: 100%;
    height: auto;
  }
}
</style>
</head>
<body>


<header>
  <h2>CONSORCIO UNIDO</h2>
</header>

<section>
  <nav>
    <ul>
    </ul>
  </nav>
  
  <article>
    <h1></h1>
    <p>London is the capital city of England. It is the most populous city in the  United Kingdom, with a metropolitan area of over 13 million inhabitants.</p>
    <p>Standing on the River Thames, London has been a major settlement for two millennia, its history going back to its founding by the Romans, who named it Londinium.</p>
  </article>
</section>

<footer>
  <p></p>
</footer>

</body>
</html>


'''


class EmailService:

    def send(self, receiver_email, subject, message):
        yag = yagmail.SMTP(NOTIFICATION_EMAIL, PASSWORD)
        try:
            yag.send(receiver_email, subject, message, prettify_html=False)
        except Exception as e:
            print(e)

    def notify_new_members(self, members, consortium):
        def worker():
            for member in members:
                self.send(member.get_email(), 'Bienvenido a Consorcio Unido', self.new_user_message(consortium))

        t = threading.Thread(target=worker)
        t.start()

    def new_user_message(self, consortium):
        return '<h3 style="color:{};">Bienvenido a Consorcio Unido</h3>'.format(HARD_COLOR) + \
               '''
               <p>Consorcio Unido es la plataforma por la cual podras gestionar las expensas de tu departamento y manejar de manera clara y fluida la comunicación con la administración.</p>
               <p>Has sido incorpado al consorcio <strong>{}</strong></p>
               <p>Ingresa <a href="http://localhost:3000/login">Aqui</a> crea tu contraseña y mira el detalle de tus gastos</p>
           '''.format(consortium.get_name())

    def notify(self, notification):
        subject, message = notification.data_for_email()

        def worker():
            for member in notification.get_consortium().get_members():
                self.send(member.get_email(), subject, message)

        t = threading.Thread(target=worker)
        t.start()
