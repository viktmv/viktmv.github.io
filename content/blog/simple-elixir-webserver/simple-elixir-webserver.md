---
title: Simple webserver with Elixir and Docker
date: "2021-01-02T11:00:00"
tags: "elixir"
---

At my [current workplace](https://tucows.com) we’re doing event driven micro-services in different languages, mostly Ruby and Python.
Having done a bare-bones micro-service in Ruby I was wondering how the same setup would look like in Elixir. Since we wanted something lightweight using Phoenix seemed like an overkill. So we ended up with using Cowboy + Plug for a simple web server.

In this post, I'll show how we went about setting it up step-by-step.
Post assumes basic familiarity with elixir, mix, and web servers in general.

Let's start up with executing `mix new server_ex`. This will create a new directory and set up our initial elixir project named 'server_ex'.

Now, let's navigate into our newly created dir (`cd server_ex`) and add some dependencies to mix.exs. In the deps method, we add plug_cowboy and Jason:

```elixir
defp deps do
  [
    {:plug_cowboy, "~> 2.4"},
    {:jason, "~> 1.2"}
  ]
end
```

We need plug_cowboy to power our server and jason to serialize some JSON data. After that let's run `mix deps.get` to get those dependecies.  

Now, we can set up our router. Let’s create a file called router.ex in our lib directory and use Plug to set up some inital routes.  
```elixir
defmodule ServerEx.Router do
  use Plug.Router
  use Plug.Debugger
  require Logger

  plug(Plug.Logger, log: :debug)
  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(:dispatch)
end
```

We’ll plug in Router and Debugger and use Logger to log things out.
We'll also use ':match' to match incoming requests to appropriate routes and plug in a JSON parser with 'Jason' decoder (which we added to mix.exs deps earlier). And, at the end, we use ':dispatch' to dispatch our actions.

Some container orchestrators require a health check so we’re gonna have one at GET /health. We set it up after all the plug declarations:
```elixir
  get "/health" do
    send_resp(conn, 200, "ok")
  end
```

Basically, what's happening there is when we use /health endpoint our app will send a response with status 200 and text 'ok'

Let's also add a catch-all matcher so we can handle requests for unknown pages:
```elixir
  match _ do
    send_resp(conn, 404, "not found")
  end
```
At this point we are almost set with application logic. But before we start our server, we need to get Cowboy to start with out main application. Also, we need to create some application configuration where we define how to start our app. 

Within 'lib', let's create a directory under the same name as our project - 'server_ex'. This will contain our application configuration, in a file called 'application.ex'
```elixir
defmodule ServerEx.Application do
  use Application
end
```

We use Application to let mix know that this is going to be our main application file. After that we define how we want to run out app.

```elixir
  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: ServerEx.Router,
        options: [ip: {0, 0, 0, 0}, port: 8080]
      )
    ]

    opts = [strategy: :one_for_one, name: ServerEx.Supervisor]
    Supervisor.start_link(children, opts)
  end
```

There's quite a bit going on here. But most important bits are: 
* We create a 'start' method to define how we want to start our app
* We specify that as part of our main application we want to run Plug.Cowboy that will use ServerEx.Router.
* We bind our server to run on 0.0.0.0 to be accessible within Docker (more on the Docker part later) and to run on port 8080  
* And then we start the process under the main Supervisor

Now we need to let mix know what to run. To do that, in out mix.exs where we have our application method defined, after 'extra_applications' we add `mod: {ServerEx.Application, []}`
So in general our application function now looks like this:
```elixir
  def application do
    [
      extra_applications: [:logger],
      mod: {ServerEx.Application, []}
    ]
  end
```

Now let’s try starting everything up.
In our root project directory run:
`mix run --no-halt`  
It might take a bit to compile but we should see a 'Generated server_ex app' message after a bit. You shoudn't see anything in your terminal at first but if you visit your localhost:8080/health in your browser you should be able to see 'ok' printed on the page.
And if we go to something like localhost:8080/whatever we should see 'not found' instead.  

Congratulations! Now we have a simple web server running.

Next, let’s attach our main handler to the root route '/' and try to accept some json params. To do this, we’ll need some modifications to our router. In our router.ex below our /health route:
```elixir
post "/" do
  IO.inspect(conn.params)
  send_resp(conn, 200, "ok")
end
```

We log the request params and return 'ok'. 

Now we can restart the server and do a curl from another terminal window:
```bash
 curl -X POST -d '{"message": "hello"}' -H 'Content-type: application/json' localhost:8080/
```

You should be able to see your params displayed neatly in your server window and "ok" response returned to your 'curl' command.
Now let’s make it a little bit more interesting and reply back with some JSON.  
In our post "/" route:  

```elixir
message = %{message: “welcome to elixir”} |> Jason.encode!()
send_resp(conn, 200, message)
```

We add that, restart the server and try our curl command from before - we'll get `{"message": "welcome to elixir"}` back to us.

Now let’s clean it up a bit and move the messages and logic to our main app file. While doing that, we'll also add a GET / handler.  
We add to handlers to our lib/server.ex file:

```elixir
def handle_post do
  message = %{text: "Hello from the POST handler"}
  {:ok, message}
end

def handle_get do
  message = %{text: "Hello from the GET handler"}
  {:ok, message}
end
```

Then we adjust our Router to use those handlers on our routes:

```elixir
post "/" do
  {:ok, message} = ServerEx.handle_post()
  send_resp(conn, 200, Jason.encode!(message))
end

get "/" do
  {:ok, message} = ServerEx.handle_get()
  send_resp(conn, 200, Jason.encode!(message))
end
```
No if we do same curl as before, we should be able to get some JSON back. Also, if we’re visiting our localhost:8080 in the browser (or sending a GET request using curl) - should see a JSON message `"text": "Hello from the GET handler"` there as well.

Of course this is very basic http server and doesn’t cover any complex logic / error handling and so on. But this is a bare-bones way to start writing a simple web-based application. 

We can also go a bit further and throw in a Dockerfile. If we want to do that, we need to create a file named 'Dockerfile' in the project root dir. Inside we'll have:

```
FROM elixir:latest

WORKDIR /app

EXPOSE 8080

COPY . /app

RUN mix local.hex --force \
 && mix local.rebar --force

RUN MIX_ENV=prod mix do deps.get, compile, release

ENTRYPOINT ["/app/_build/prod/rel/server_ex/bin/server_ex"]
CMD ["start", "foreground"]
```
What happens there? Basically, we use mix to compile and build a _production_ release which is going to be located at `/app/_build/prod/rel/YOUR_APP_NAME/bin/YOUR_APP_NAME` with app name in our case being 'server_ex'.  

And now, provided you have Docker installed on your machine - you can run `docker build . -t server_ex && docker run -p 8080:8080/tcp server_ex` - this will build you project, tag it, and run it on port 8080.  

This concludes part one of simple web server in Elixir. In part 2 I'll show how to add a simple Kafka setup to this project.

Code for this post can be found [on Github](https://github.com/viktmv/server_ex)
