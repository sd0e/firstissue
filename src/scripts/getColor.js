export default function getColor(status) {
    return status === 'available' ? '#15b015' : status === 'assigned' ? '#4e53d9' : '#a61212';
}