'use client'
import {Box,Stack,Typography,Button,Modal,TextField} from '@mui/material'
import { initializeApp } from 'firebase/app';
import { getDoc,deleteDoc,getFirestore, collection, query, getDocs ,doc,setDoc} from 'firebase/firestore';
import { useEffect, useState } from 'react';
//materialui,firebase.nextjs

const firebaseConfig = {
  apiKey: "AIzaSyADEr1l_TU0J47LdS11lBtQcWYe_qabRzM",
  authDomain: "project1-20e36.firebaseapp.com",
  projectId: "project1-20e36",
  storageBucket: "project1-20e36.appspot.com",
  messagingSenderId: "150697849249",
  appId: "1:150697849249:web:f32c664a784d0132401be0",
  measurementId: "G-LFKX8VT8L6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebase=getFirestore(app);
const firestore=getFirestore(app);

const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap:3,
  display:'flex',
  flexDirection:'column'
};

export default function Home() {
  const [pantry,setPantry]=useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName,setItemName]=useState('');
  const updatePantry = async () => {

    const snapshot = query(collection(firebase, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList=[]
    docs.forEach((doc) => {
    console.log(doc.id, doc.data())
       pantryList.push({"name":doc.id,...doc.data()});
    })
    console.log(pantryList);
    setPantry(pantryList)
  
};
  useEffect(() => {
    // Define the async function inside useEffect
      updatePantry();
  }, []); 
 
  const addItem = async (item) => {
    if (!item) return; // Ensure item is not an empty string
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
    } else {
        await setDoc(docRef, { count: 1 });
    }
    
    await updatePantry(); // Update the pantry after adding an item
    return
};

const removeItem = async (item) => {
    if (!item) return; // Ensure item is not an empty string
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const { count } = docSnap.data();
        if (count === 1) {
            await deleteDoc(docRef); // Delete the item if count is 1
        } else {
            await setDoc(docRef, { count: count - 1 }); // Decrease the count
        }
    }
    
    await updatePantry(); // Update the pantry after removing an item
};

  
    
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={'2'}
    >  
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}  >
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add Item
      </Typography>
      <Stack width="100%" direction={'row'} spacing={2} >
     <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e)=>setItemName(e.target.value)}/>
     <Button variant="outlined" onClick={()=>{
      addItem(itemName)
      handleClose()     }}>Search</Button>
</Stack>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography>
    </Box>
  </Modal>
        <Button variant="contained" onClick={handleOpen} >ADD</Button>
      
      <Box  border={'1px solid black'} >
    
      <Box width="800px" height="100px" bgcolor={'skyblue'} justifyContent={'center'}display={'flex'}>
        <Typography variant="h2" color={'#333'} textAlign="center">Pantry Items</Typography>

      </Box>
      <Stack
        width="800px" 
        height="300px"
        spacing={2}
        overflow={'auto'}

      >
        {pantry.map(({name,count}) => (
         
          <Box
            key={name}
            width="100%"
            height="200px"
            inheight='300px'
            display={'flex'}
            justifyContent={'space-between'}
            
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            padding={5}
          >
                    <Typography variant="h2" color={'#333'} textAlign="center"> 
           { name}
           </Typography>
           <Typography variant="h3" color={'#333'} textAlign="center"> 
           Quantity {count}
            </Typography>
         <Button variant="contained" onClick={()=>removeItem(name)} >
          REMOVE
          </Button>
          </Box>
          
        ))}
      </Stack>
      </Box>
    </Box>
  );
}