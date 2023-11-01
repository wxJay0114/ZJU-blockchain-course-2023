import {useState} from "react";
import {BorrowYourCarContract, web3} from "../utils/contracts";
import "hardhat/console.sol";

const BorrowYourCarPage = () => {
    const [carId1, setCarId1] = useState(0)
    const [carId2, setCarId2] = useState(0)
    const [duration, setDuration] = useState(0)
    const [id, setID] = useState('')
    const [owner, setOwner1] = useState('')
    const [borrower, setBorrower1] = useState('')
    const [message1, setMessage] = useState('')
    const [message2, setMessage2] = useState('')
    const [list, setList] = useState([])
    const [notborrowedlist,setNotBorrowedList] = useState([])


    const uploadeCarInfo = async () => {
        if(BorrowYourCarContract) {
            const accounts = await web3.eth.getAccounts()
            if(accounts.length === 0) {
                alert('Not connected yet.')
                return
            }
            const result = await BorrowYourCarContract.methods.mintCarNFT(accounts[0]).send({
                from: accounts[0]
            })
            if (result.events && result.events.UpdateCar){
                setID(result.events.UpdateCar.returnValues.carTokenId)
                console.log('Upload Successfully.')
            } else {
                console.log('Upload Failed.')
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const CheckList = async () => {
        const accounts = await web3.eth.getAccounts()
        if(accounts.length === 0) {
            alert('Not connected yet.')
            return
        }
        if(BorrowYourCarContract) {
            const result = await BorrowYourCarContract.methods.carlistCheck().send({
                from: accounts[0]
            })
            if (result.events && result.events.CarList){
                setList(result.events.CarList.returnValues.list.join(', '))

            } else {
                console.log('No CarList Event Found')
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const CheckNotBorrowedList = async () => {
        const accounts = await web3.eth.getAccounts()
        if(accounts.length === 0) {
            alert('Not connected yet.')
            return
        }
        if(BorrowYourCarContract) {
            const result = await BorrowYourCarContract.methods.NotBorrowedcarlistCheck().send({
                from: accounts[0]
            })
            console.log(notborrowedlist)
            if (result.events && result.events.NotBorrowedList){
                setNotBorrowedList(result.events.NotBorrowedList.returnValues.list.join(', '))
                
            } else {
                console.log('No NotBorrowedList Event Found')
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const CheckCarInfo = async () => {
        const accounts = await web3.eth.getAccounts()
        if(accounts.length === 0) {
            alert('Not connected yet.')
            return
        }
        if(BorrowYourCarContract) {
            const result = await BorrowYourCarContract.methods.InfoCheck(carId1).send({
                from: accounts[0]
            })
            if (result.events && result.events.CarInfo){
                setOwner1(result.events.CarInfo.returnValues.owner)
                setBorrower1(result.events.CarInfo.returnValues.borrower)
                setMessage(result.events.CarInfo.returnValues.message)
            } else {
                console.log('No CatInfo Event Found')
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const BorrowCars = async () => {
        const accounts = await web3.eth.getAccounts()
        if(accounts.length === 0) {
            alert('Not connected yet.')
            return
        }
        if(BorrowYourCarContract) {
            const result = await BorrowYourCarContract.methods.BorrowCar(carId2,duration).send({
                from: accounts[0]
            })
            if (result.events && result.events.CarBorrowed){
                setCarId2(result.events.CarBorrowed.returnValue.carTokenId)
                setDuration(result.events.CarBorrowed.returnValue.duration)
                setMessage2(result.events.CarBorrowed.returnValue.message)
                console.log('Boorow Success!')
            } else {
                console.log('No BorrowCar Event Found')
            }
        } else {
            alert('Contract not exists.')
        }
    }

    return (
        <div>
            <h1>BorrowCar System</h1>
            
            <h2>Upload Car Information</h2>
            <button onClick={uploadeCarInfo}>Upload</button>
            <div>New CarID: {id}</div>
                
            <h2>Check Car List</h2>
            <button onClick={CheckList}>Check</button>
            <div>CarList: {list}</div>
                
            <h2>Check Not Borrowed Car List</h2>
            <button onClick={CheckNotBorrowedList}>Check</button>
            <div>CarList-NotBorrowed: {notborrowedlist}</div>

            <h2>Check Car Information</h2>
            <div>
                <div>Input CarID: </div>
                <input onChange={(e) => setCarId1(parseInt(e.target.value))}/>
            </div>
            <button onClick={CheckCarInfo}>Check</button>
            <div>Car Owner: {owner}</div>
            <div>Car Borrower: {borrower}</div>
            <div>{message1}</div>

            <h2>Borrow Car</h2>
            <div>
                <div>Input CarID: </div>
                <input onChange={(e) => setCarId2(parseInt(e.target.value))}/>
            </div>
            <div>
                <div>Input Borrow Duration: </div>
                <input onChange={(e) => setDuration(parseInt(e.target.value))}/>
            </div>
            <button onClick={BorrowCars}>Borrow</button>
            <div>CarID: {carId2}</div>
            <div>Duration: {duration}</div>
            <div>{message2}</div>
        </div>
    )
}

export default BorrowYourCarPage