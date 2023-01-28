import websocket
import _thread
from contextlib import closing
import time
import rel
from websocket import create_connection
import torch
import random
import ast

params = torch.load("backend\params.pt")

# Test dropout, momentum, etc
def nn(input, param_dict):
    
    # Reshape tensor
    x = input.view(-1 , 4*49)

    # First fully-connected layer
    x = torch.relu_(x @ param_dict['W0'] + param_dict['b0'])
    
    # Second fully-connected layer
    x = torch.relu_(x @ param_dict['W1'] + param_dict['b1'])
    
    # Third fully-connected layer
    x = torch.relu_(x @ param_dict['W2']  + param_dict['b2'])
    
    # Fourth fully-connected layer
    x = torch.relu_(x @ param_dict['W3']  + param_dict['b3'])
    
    # Output layer
    x = x @ param_dict['W4']  + param_dict['b4']

    return x

def on_message(ws, message):
    if not message.isnumeric():
        print(message)
        
        # DO STUFF WITH THE INPUT TO MAKE IT NN-ABLE
        notes = torch.zeros(4, 49)
        
        song = []
        
        message = ast.literal_eval(message)
                
        for i in range(len(message)-3):
            num = random.randint(0, 2)
            if num <= 1: # spawn a bass note
                notes = torch.zeros(4, 49)
                notes[0][int(message[i][0])-36] = 1
                notes[0][int(message[i+1][0])-36] = 1
                notes[0][int(message[i+2][0])-36] = 1
                notes[0][int(message[i+3][0])-36] = 1

                root = (nn(notes, params).argmax(1)+36).item()
                timing = 0.8
                song.append([message[i], [root, timing], [root+7, timing]])
            else:
                song.append([message[i], [-1]]) 
        song.append([message[len(message)-2], -1])
        song.append([message[len(message)-1], -1])
        with closing(create_connection("wss://socketsbay.com/wss/v2/3/11ddc86a34cc702f0ed2cf199513e3dd/")) as conn:
            conn.send(str(song))

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    print("Opened connection")

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://socketsbay.com/wss/v2/1/11ddc86a34cc702f0ed2cf199513e3dd/",
                              on_open=on_open,
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close)

    ws.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch() 